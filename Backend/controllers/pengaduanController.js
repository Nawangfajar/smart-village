const { Pengaduan, User } = require('../models');
const admin = require('../config/firebase'); // 🔔 FCM
const { sequelize } = require('../models');
const multer = require('multer');
const path = require('path');
const PDFDocument = require('pdfkit');
const dayjs = require('dayjs');
const { Op } = require('sequelize');



/* =========================================================
   UPLOAD FOTO PENGADUAN
========================================================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}-${random}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 }, // 60MB
}).single('foto');

exports.uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: 'Gagal upload foto',
        error: err.message,
      });
    }
    next();
  });
};

/* =========================================================
   BUAT PENGADUAN (MASYARAKAT)
========================================================= */
exports.buatPengaduan = async (req, res) => {
  try {
    const {
      user_id,
      judul,
      isi,
      latitude,
      longitude,
      alamat_lokasi,
    } = req.body;

    if (!user_id || !judul || !isi) {
      return res.status(400).json({
        message: 'user_id, judul, dan isi wajib diisi',
      });
    }

    // validasi koordinat
    if (
      (latitude && isNaN(latitude)) ||
      (longitude && isNaN(longitude))
    ) {
      return res.status(400).json({
        message: 'Latitude dan longitude harus berupa angka',
      });
    }

    const foto = req.file ? req.file.filename : null;

    const pengaduan = await Pengaduan.create({
      user_id,
      judul,
      isi,
      foto,
      latitude,
      longitude,
      alamat_lokasi,
      status: 'dikirim',
    });

    res.status(201).json({
      message: 'Pengaduan berhasil dikirim',
      pengaduan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Gagal membuat pengaduan',
      error: error.message,
    });
  }
};

/* =========================================================
   RIWAYAT PENGADUAN USER (MASYARAKAT)
========================================================= */
exports.getRiwayatPengaduanByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const data = await Pengaduan.findAll({
      where: { user_id },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Gagal mengambil riwayat pengaduan',
      error: error.message,
    });
  }
};

/* =========================================================
   RIWAYAT SEMUA PENGADUAN (ADMIN)
========================================================= */
exports.getRiwayatPengaduanAll = async (req, res) => {
  try {
    const { tahun = new Date().getFullYear() } = req.query;

    let whereClause = {};

    if (tahun) {
      const startDate = dayjs(`${tahun}-01-01`).startOf('year').toDate();
      const endDate = dayjs(`${tahun}-12-31`).endOf('year').toDate();

      whereClause.createdAt = {
        [Op.between]: [startDate, endDate],
      };
    }

    const data = await Pengaduan.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data pengaduan',
      error: error.message,
    });
  }
};


exports.getDaftarTahunPengaduan = async (req, res) => {
  try {
    const data = await Pengaduan.findAll({
      attributes: ['createdAt'],
    });

    const tahunList = [
      ...new Set(
        data.map((p) => new Date(p.createdAt).getFullYear())
      ),
    ].sort((a, b) => b - a);

    res.json(tahunList);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil daftar tahun',
      error: error.message,
    });
  }
};


exports.getStatistikPengaduanTahunan = async (req, res) => {
  try {
    const { tahun = new Date().getFullYear() } = req.query;

    const startDate = new Date(`${tahun}-01-01 00:00:00`);
    const endDate = new Date(`${tahun}-12-31 23:59:59`);

    const data = await Pengaduan.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'total'],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ['status'],
    });

    // default semua 0
    const statistik = {
      dikirim: 0,
      diproses: 0,
      selesai: 0,
      ditolak: 0,
    };

    data.forEach((item) => {
      statistik[item.status] = Number(item.get('total'));
    });

    res.json(statistik);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Gagal mengambil statistik pengaduan',
    });
  }
};


/* =========================================================
   UPDATE STATUS (ADMIN)
========================================================= */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ['diproses', 'selesai', 'ditolak'];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message: 'Status tidak valid (diproses | selesai | ditolak)',
      });
    }

    // Ambil pengaduan + user
    const pengaduan = await Pengaduan.findByPk(id, {
      include: {
        model: User,
        attributes: ['id', 'fcm_token'],
      },
    });

    if (!pengaduan) {
      return res.status(404).json({
        message: 'Pengaduan tidak ditemukan',
      });
    }

    // Update status
    pengaduan.status = status;
    await pengaduan.save();

    // ================== KIRIM NOTIFIKASI ==================
    if (pengaduan.User && pengaduan.User.fcm_token) {
      const message = {
        token: pengaduan.User.fcm_token,
        notification: {
          title: 'Update Status Pengaduan',
          body: `Pengaduan "${pengaduan.judul}" sekarang berstatus: ${status.toUpperCase()}`,
        },
        data: {
          type: 'pengaduan',
          pengaduan_id: pengaduan.id.toString(),
          status,
        },
      };

      await admin.messaging().send(message);
    }

    res.status(200).json({
      message: 'Status berhasil diperbarui & notifikasi terkirim',
      pengaduan,
    });
  } catch (error) {
    console.error('Error update status pengaduan:', error);
    res.status(500).json({
      message: 'Gagal memperbarui status',
      error: error.message,
    });
  }
};

/* =========================================================
   CETAK LAPORAN PENGADUAN TAHUNAN (PDF) – RAPI
========================================================= */
exports.cetakPengaduanTahunan = async (req, res) => {
  try {
    const { tahun } = req.query;
    if (!tahun) {
      return res.status(400).json({ message: 'Tahun wajib diisi' });
    }

    const startDate = dayjs(`${tahun}-01-01`).startOf('year').toDate();
    const endDate = dayjs(startDate).endOf('year').toDate();

    const data = await Pengaduan.findAll({
      where: { createdAt: { [Op.between]: [startDate, endDate] } },
      order: [['createdAt', 'ASC']],
    });

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=laporan_pengaduan_tahun_${tahun}.pdf`
    );
    doc.pipe(res);

    /* ================= HEADER ================= */
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('LAPORAN PENGADUAN MASYARAKAT', { align: 'center' });

    doc
      .font('Helvetica')
      .fontSize(11)
      .text('Padukuhan V Tirtonirmolo', { align: 'center' });

    doc
      .fontSize(11)
      .text(`Periode Tahun ${tahun}`, { align: 'center' });

    doc.moveDown(2);

    /* ================= ISI ================= */
    if (data.length === 0) {
      doc.text('Tidak ada pengaduan pada tahun ini.');
    } else {
      data.forEach((p, i) => {
        // 🔹 Judul Pengaduan
        doc
          .font('Helvetica-Bold')
          .fontSize(11)
          .text(`${i + 1}. ${p.judul.toUpperCase()}`);

        doc.moveDown(0.3);

        // 🔹 Detail (label : value)
        const writeRow = (label, value) => {
          doc
            .font('Helvetica')
            .fontSize(10)
            .text(`${label}`, { continued: true })
            .font('Helvetica-Bold')
            .text(` ${value}`);
        };

        writeRow('Isi Pengaduan   :', p.isi);
        writeRow('Lokasi          :', p.alamat_lokasi || '-');
        writeRow(
          'Koordinat       :',
          p.latitude && p.longitude
            ? `${p.latitude}, ${p.longitude}`
            : '-'
        );
        writeRow('Status          :', p.status);
        writeRow(
          'Tanggal         :',
          dayjs(p.createdAt).format('DD-MM-YYYY')
        );

        doc.moveDown(0.8);

        // 🔹 Garis pemisah
        doc
          .moveTo(50, doc.y)
          .lineTo(545, doc.y)
          .strokeColor('#cccccc')
          .stroke();

        doc.moveDown(0.8);
      });
    }

    /* ================= FOOTER ================= */
    doc.moveDown(1);
    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(`Total Pengaduan Tahun ${tahun}: ${data.length}`, {
        align: 'right',
      });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Gagal mencetak laporan',
      error: error.message,
    });
  }
};
