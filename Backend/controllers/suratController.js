console.log('=== suratController LOADING ===');

const fs = require('fs');
const path = require('path');
const { SuratDomisili, User, SuratTemplate } = require('../models');
const admin = require('../config/firebase'); // 🔔 FCM
const PDFDocument = require('pdfkit');
const dayjs = require('dayjs');
const Joi = require('joi');
const { Op } = require('sequelize');

/* ================= VALIDASI (JWT MODE) ================= */
const domisiliSchema = Joi.object({
  nama: Joi.string().required(),
  nik: Joi.string().required(),
  ttl: Joi.string().required(),
  jenisKelamin: Joi.string().required(),
  agama: Joi.string().required(),
  pekerjaan: Joi.string().required(),
  alamatAsal: Joi.string().required(),
  alamatDomisili: Joi.string().required(),
  rt: Joi.string().required(),
  rw: Joi.string().required(),
  lamaMenetap: Joi.string().required(),
  statusTempatTinggal: Joi.string().required(),
  keperluanSurat: Joi.string().required(),
});

/* ================= GENERATE PDF (PAKAI TEMPLATE) ================= */
const generatePDF = async (suratData) => {
  const template = await SuratTemplate.findOne({
    where: { jenis_surat: 'domisili' },
  });

  if (!template) {
    throw new Error('Template surat domisili belum tersedia');
  }

  const fileDir = path.join(__dirname, '../public/surat_domisili');
  if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });

  const fileName = `surat_keterangan_domisili_${Date.now()}.pdf`;
  const filePath = path.join(fileDir, fileName);
  const filePublicPath = `/surat_domisili/${fileName}`;

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 60, left: 70, right: 70, bottom: 60 },
  });

  doc.pipe(fs.createWriteStream(filePath));

  /* ===== KOP ===== */
  doc.font('Helvetica-Bold').fontSize(12).text(template.nama_instansi, { align: 'center' });
  doc.fontSize(10).text(template.alamat_instansi, { align: 'center' });

  doc.moveDown(0.8);
  doc.moveTo(70, doc.y).lineTo(525, doc.y).stroke();
  doc.moveDown(1.8);

  /* ===== JUDUL ===== */
  doc.fontSize(14).text('SURAT KETERANGAN DOMISILI', { align: 'center' });
  doc.fontSize(11).text(`Nomor: ${suratData.nomor_surat}`, { align: 'center' });
  doc.moveDown(2);

  /* ===== ISI ===== */
  doc.text(
    `Yang bertanda tangan di bawah ini, ${template.jabatan_pejabat}, menerangkan bahwa:`,
    { align: 'justify' }
  );
  doc.moveDown(1.2);

  const row = (label, value) => {
    doc.font('Helvetica-Bold').text(label, 90);
    doc.font('Helvetica').text(':', 260, doc.y - 13);
    doc.text(value || '-', 275, doc.y - 13);
    doc.moveDown(0.6);
  };

  row('Nama', suratData.nama);
  row('NIK', suratData.nik);
  row('Tempat / Tanggal Lahir', suratData.ttl);
  row('Jenis Kelamin', suratData.jenis_kelamin);
  row('Agama', suratData.agama);
  row('Pekerjaan', suratData.pekerjaan);
  row('Alamat Domisili', suratData.alamat_domisili);
  row('RT / RW', `${suratData.rt} / ${suratData.rw}`);
  row('Keperluan', suratData.keperluan_surat);

  doc.moveDown(1.2);
  doc.text(
    `Surat ini dibuat untuk keperluan administrasi sebagaimana mestinya.`,
    { align: 'justify' }
  );

  /* ===== TTD ===== */
  doc.moveDown(3);
  doc.text(
    `${template.tempat_surat}, ${dayjs().format('DD MMMM YYYY')}`,
    340
  );
  doc.text(template.jabatan_pejabat, 340);
  doc.moveDown(2);
  doc.font('Helvetica-Bold').text(template.nama_pejabat, 340);
  doc.font('Helvetica').text(`NIP. ${template.nip}`, 340);

  doc.end();
  return filePublicPath;
};

/* ================= CONTROLLERS ================= */

// ================= USER: BUAT SURAT =================
const generateDomisili = async (req, res) => {
  const { error, value } = domisiliSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  if (!req.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const surat = await SuratDomisili.create({
      nomor_surat: `470/${Math.floor(Math.random() * 900) + 100}/2025`,
      nama: value.nama,
      nik: value.nik,
      ttl: value.ttl,
      jenis_kelamin: value.jenisKelamin,
      agama: value.agama,
      pekerjaan: value.pekerjaan,
      alamat_asal: value.alamatAsal,
      alamat_domisili: value.alamatDomisili,
      rt: value.rt,
      rw: value.rw,
      lama_menetap: value.lamaMenetap,
      status_tempat_tinggal: value.statusTempatTinggal,
      keperluan_surat: value.keperluanSurat,
      tempat_surat: 'Padukuhan V',
      tanggal_surat: new Date(),
      jabatan_pejabat: 'Kepala Padukuhan',
      nama_pejabat: 'Sutrisno, S.E.',
      nip: '1234567890',
      user_id: req.user.id,
      status: 'Pending',
    });

    res.status(201).json({ message: 'Surat berhasil dibuat', data: surat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal membuat surat' });
  }
};

// ================= ADMIN: SEMUA SURAT =================

// ================= ADMIN: SEMUA SURAT + FILTER TAHUN =================
const getAllSurat = async (req, res) => {
  try {
    const { year } = req.query;

    let whereCondition = {};

    if (year) {
      whereCondition = {
        createdAt: {
          [Op.between]: [
            new Date(`${year}-01-01 00:00:00`),
            new Date(`${year}-12-31 23:59:59`)
          ]
        }
      };
    }

    const data = await SuratDomisili.findAll({
      where: whereCondition,
      order: [['createdAt', 'DESC']],
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data surat' });
  }
};

// ================= USER: RIWAYAT =================
const getSuratByUser = async (req, res) => {
  const data = await SuratDomisili.findAll({
    where: { user_id: req.user.id },
    order: [['createdAt', 'DESC']],
  });
  res.json(data);
};

// ================= ADMIN: TERIMA =================
const terimaSurat = async (req, res) => {
  const surat = await SuratDomisili.findByPk(req.params.id, {
    include: { model: User, attributes: ['fcm_token'] },
  });

  if (!surat) return res.status(404).json({ message: 'Surat tidak ditemukan' });

  surat.filePath = await generatePDF(surat);
  surat.status = 'Diterima';
  await surat.save();

  // 🔔 FCM
  if (surat.User?.fcm_token) {
    await admin.messaging().send({
      token: surat.User.fcm_token,
      notification: {
        title: 'Surat Domisili Diterima',
        body: 'Surat domisili Anda telah diterima dan siap diunduh.',
      },
      data: {
        type: 'surat_domisili',
        surat_id: surat.id.toString(),
        status: 'Diterima',
      },
    });
  }

  res.json({ message: 'Surat diterima', data: surat });
};

// ================= ADMIN: TOLAK =================
const tolakSurat = async (req, res) => {
  const surat = await SuratDomisili.findByPk(req.params.id, {
    include: { model: User, attributes: ['fcm_token'] },
  });

  if (!surat) return res.status(404).json({ message: 'Surat tidak ditemukan' });

  surat.status = 'Ditolak';
  surat.filePath = null;
  await surat.save();

  // 🔔 FCM
  if (surat.User?.fcm_token) {
    await admin.messaging().send({
      token: surat.User.fcm_token,
      notification: {
        title: 'Surat Domisili Ditolak',
        body: 'Permohonan surat domisili Anda ditolak.',
      },
      data: {
        type: 'surat_domisili',
        surat_id: surat.id.toString(),
        status: 'Ditolak',
      },
    });
  }

  res.json({ message: 'Surat ditolak', data: surat });
};

// ================= DETAIL =================
const getDetailSurat = async (req, res) => {
  const surat = await SuratDomisili.findByPk(req.params.id);
  res.json(surat);
};

// ================= DOWNLOAD =================
const downloadSurat = async (req, res) => {
  const surat = await SuratDomisili.findByPk(req.params.id);
  if (!surat || surat.status !== 'Diterima') {
    return res.status(400).json({ message: 'Surat belum dapat diunduh' });
  }

  const file = path.join(__dirname, '../public', surat.filePath);
  res.download(file);
};

// ================= ADMIN: TOTAL SURAT =================
const getTotalSurat = async (req, res) => {
  try {
    const { year } = req.query;

    let whereCondition = {};
    if (year) {
      whereCondition.createdAt = {
        [Op.between]: [
          new Date(`${year}-01-01 00:00:00`),
          new Date(`${year}-12-31 23:59:59`)
        ]
      };
    }

    const total = await SuratDomisili.count({ where: whereCondition });
    const pending = await SuratDomisili.count({
      where: { ...whereCondition, status: 'Pending' }
    });
    const diterima = await SuratDomisili.count({
      where: { ...whereCondition, status: 'Diterima' }
    });
    const ditolak = await SuratDomisili.count({
      where: { ...whereCondition, status: 'Ditolak' }
    });

    res.json({
      total,
      pending,
      diterima,
      ditolak,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil statistik surat' });
  }
};


console.log('=== suratController LOADED ===');

module.exports = {
  generateDomisili,
  getAllSurat,
  getSuratByUser,
  terimaSurat,
  tolakSurat,
  getDetailSurat,
  downloadSurat,
  getTotalSurat,
};
