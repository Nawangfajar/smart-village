const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../models');
const admin = require('../config/firebase'); // 🔔 FCM

// ================== SETUP FOLDER UPLOAD ==================
const dir = 'uploads/kegiatan/';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// ================== MULTER STORAGE ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadMiddleware = multer({ storage }).single('foto');

// ================== CREATE KEGIATAN + NOTIFIKASI ==================
const buatKegiatan = async (req, res) => {
  try {
    const { nama_kegiatan, tanggal, lokasi, waktu } = req.body;
    const foto = req.file ? req.file.filename : null;

    if (!nama_kegiatan || !tanggal || !lokasi || !waktu) {
      return res.status(400).json({
        message: 'Field nama_kegiatan, tanggal, lokasi, dan waktu wajib diisi.',
      });
    }

    // Simpan kegiatan
    const kegiatan = await db.Kegiatan.create({
      nama_kegiatan,
      foto,
      tanggal,
      lokasi,
      waktu
    });

    // ================== KIRIM NOTIFIKASI FCM ==================
    const message = {
      topic: 'kegiatan',
      notification: {
        title: 'Kegiatan Baru',
        body: `${nama_kegiatan} • ${tanggal} (${waktu})`,
      },
      data: {
        type: 'kegiatan',
        kegiatan_id: kegiatan.id.toString(),
      },
    };

    await admin.messaging().send(message);

    res.status(201).json({
      message: 'Kegiatan berhasil dibuat & notifikasi terkirim!',
      kegiatan,
    });
  } catch (error) {
    console.error('Error buat kegiatan:', error);
    res.status(500).json({
      message: 'Gagal membuat kegiatan!',
      error: error.message,
    });
  }
};

// ================== GET ALL KEGIATAN ==================
const getRiwayatKegiatan = async (req, res) => {
  try {
    const kegiatan = await db.Kegiatan.findAll({
      order: [['tanggal', 'DESC']],
    });
    res.status(200).json(kegiatan);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil riwayat kegiatan!',
      error: error.message,
    });
  }
};

// ================== GET KEGIATAN BY ID ==================
const getKegiatanById = async (req, res) => {
  try {
    const kegiatan = await db.Kegiatan.findByPk(req.params.id);
    if (!kegiatan) {
      return res.status(404).json({ message: 'Kegiatan tidak ditemukan.' });
    }
    res.status(200).json(kegiatan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== UPDATE KEGIATAN ==================
const updateKegiatan = async (req, res) => {
  try {
    const { nama_kegiatan, tanggal, lokasi, waktu } = req.body;
    const kegiatan = await db.Kegiatan.findByPk(req.params.id);

    if (!kegiatan) {
      return res.status(404).json({ message: 'Kegiatan tidak ditemukan.' });
    }

    // Hapus foto lama jika upload baru
    if (req.file && kegiatan.foto) {
      const oldPath = path.join(dir, kegiatan.foto);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    kegiatan.nama_kegiatan = nama_kegiatan || kegiatan.nama_kegiatan;
    kegiatan.tanggal = tanggal || kegiatan.tanggal;
    kegiatan.lokasi = lokasi || kegiatan.lokasi;
    kegiatan.waktu = waktu || kegiatan.waktu;
    kegiatan.foto = req.file ? req.file.filename : kegiatan.foto;

    await kegiatan.save();

    res.status(200).json({
      message: 'Kegiatan berhasil diperbarui.',
      kegiatan,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Gagal memperbarui kegiatan.',
      error: error.message,
    });
  }
};

// ================== DELETE KEGIATAN ==================
const deleteKegiatan = async (req, res) => {
  try {
    const kegiatan = await db.Kegiatan.findByPk(req.params.id);
    if (!kegiatan) {
      return res.status(404).json({ message: 'Kegiatan tidak ditemukan.' });
    }

    if (kegiatan.foto) {
      const fotoPath = path.join(dir, kegiatan.foto);
      if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
    }

    await kegiatan.destroy();

    res.status(200).json({ message: 'Kegiatan berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadMiddleware,
  buatKegiatan,
  getRiwayatKegiatan,
  getKegiatanById,
  updateKegiatan,
  deleteKegiatan
};
