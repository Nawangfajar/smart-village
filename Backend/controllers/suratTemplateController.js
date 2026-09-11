const { SuratTemplate } = require('../models');

// ===== GET TEMPLATE =====
exports.getTemplate = async (req, res) => {
  try {
    let template = await SuratTemplate.findOne({
      where: { jenis_surat: 'domisili' },
    });

    // ✅ JIKA BELUM ADA → BUAT DEFAULT
    if (!template) {
      template = await SuratTemplate.create({
        jenis_surat: 'domisili',
        nama_instansi: 'PEMERINTAH PADUKUHAN V',
        alamat_instansi: 'Padukuhan V Tirtonirmolo Kasihan Bantul',
        jabatan_pejabat: 'Kepala Padukuhan',
        nama_pejabat: 'Nama Pejabat',
        nip: '-',
        tempat_surat: 'Bantul',
        catatan_bawah: 'Yang bersangkutan benar berdomisili pada alamat tersebut 3 tahun. Surat keterangan ini dibuat untuk keperluan administrasi sebagaimana tersebut di atas.',
      });
    }

    res.status(200).json(template);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Gagal memuat template surat',
      error: error.message,
    });
  }
};

exports.updateTemplate = async (req, res) => {
  const template = await SuratTemplate.findOne({
    where: { jenis_surat: 'domisili' },
  });

  await template.update(req.body);

  res.json({
    message: 'Template surat berhasil diperbarui',
    data: template,
  });
};
