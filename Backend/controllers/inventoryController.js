const { Inventory, Peminjaman, User } = require('../models');
const PDFDocument = require('pdfkit');
const dayjs = require('dayjs');

/* ======================================================
   HELPER: HITUNG JUMLAH TOTAL & SISA PINJAM
====================================================== */
const enrichInventoryData = async (inventories) => {
  const peminjamanAktif = await Peminjaman.findAll({
    where: { status: 'dipinjam' }
  });

  return inventories.map(item => {
    const totalDipinjam = peminjamanAktif
      .filter(p => p.inventory_id === item.id)
      .reduce((sum, p) => sum + p.jumlah_pinjam, 0);

    return {
      ...item.toJSON(),
      jumlah_total: item.jumlah + totalDipinjam,
      sisa_bisa_dipinjam:
        item.tipe_inventori === 'pinjam' ? item.jumlah : null
    };
  });
};

/* ================= CRUD INVENTORI ================= */

const getAllInventories = async (req, res) => {
  try {
    const { tipe } = req.query;
    const whereCondition = tipe ? { tipe_inventori: tipe } : {};

    const inventories = await Inventory.findAll({
      where: whereCondition,
      order: [['nama_barang', 'ASC']]
    });

    const result = await enrichInventoryData(inventories);
    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const result = await enrichInventoryData([inventory]);
    res.status(200).json(result[0]);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createInventory = async (req, res) => {
  const { nama_barang, jumlah, tipe_inventori } = req.body;

  try {
    const inventory = await Inventory.create({
      nama_barang,
      jumlah,
      tipe_inventori
    });

    res.status(201).json(inventory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateInventory = async (req, res) => {
  const { nama_barang, jumlah, tipe_inventori } = req.body;

  try {
    const inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: 'Item not found' });
    }

    inventory.nama_barang = nama_barang;
    inventory.jumlah = jumlah;
    inventory.tipe_inventori = tipe_inventori;
    await inventory.save();

    res.status(200).json(inventory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await inventory.destroy();
    res.status(200).json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= FITUR PINJAM ================= */

const pinjamInventori = async (req, res) => {
  const { userId, jumlah_pinjam, tanggal_sampai } = req.body;
  const { id } = req.params;

  try {
    if (!tanggal_sampai) {
      return res.status(400).json({
        message: 'Tanggal sampai wajib diisi'
      });
    }

    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      return res.status(404).json({ message: 'Barang tidak ditemukan' });
    }

    if (inventory.tipe_inventori !== 'pinjam') {
      return res.status(403).json({
        message: 'Barang ini hanya untuk pencatatan dan tidak bisa dipinjam'
      });
    }

    if (inventory.jumlah < jumlah_pinjam) {
      return res.status(400).json({ message: 'Stok tidak mencukupi' });
    }

    const existingLoan = await Peminjaman.findOne({
      where: {
        user_id: userId,
        inventory_id: id,
        status: 'dipinjam'
      }
    });

    if (existingLoan) {
      return res.status(400).json({
        message: 'Barang ini masih dipinjam oleh user'
      });
    }

    inventory.jumlah -= jumlah_pinjam;
    await inventory.save();

    const peminjaman = await Peminjaman.create({
      user_id: userId,
      inventory_id: id,
      jumlah_pinjam,
      tanggal_pinjam: new Date(),
      tanggal_sampai,
      status: 'dipinjam'
    });

    res.json({
      message: 'Barang berhasil dipinjam',
      peminjaman
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= FITUR KEMBALI ================= */

const kembalikanInventori = async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  try {
    const peminjaman = await Peminjaman.findOne({
      where: {
        user_id: userId,
        inventory_id: id,
        status: 'dipinjam'
      }
    });

    if (!peminjaman) {
      return res.status(404).json({ message: 'Tidak ada pinjaman aktif' });
    }

    const inventory = await Inventory.findByPk(id);
    inventory.jumlah += peminjaman.jumlah_pinjam;
    await inventory.save();

    peminjaman.status = 'dikembalikan';
    peminjaman.tanggal_kembali = new Date();
    await peminjaman.save();

    res.json({ message: 'Barang berhasil dikembalikan' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= CEK STATUS PINJAMAN USER ================= */

const getActiveLoan = async (req, res) => {
  const { id, userId } = req.params;

  try {
    const peminjaman = await Peminjaman.findOne({
      where: {
        inventory_id: id,
        user_id: userId,
        status: 'dipinjam'
      }
    });

    res.json({
      isBorrowing: !!peminjaman,
      peminjaman: peminjaman || null
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= LIST PEMINJAMAN AKTIF (ADMIN) ================= */

const getAllLoansDipinjam = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.findAll({
      where: { status: 'dipinjam' },
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: Inventory, attributes: ['nama_barang'] }
      ],
      order: [['tanggal_pinjam', 'DESC']]
    });

    res.json(peminjaman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= CETAK INVENTORI (PDF) ================= */

const cetakInventori = async (req, res) => {
  try {
    const inventories = await Inventory.findAll({
      order: [['nama_barang', 'ASC']]
    });

    const enriched = await enrichInventoryData(inventories);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'inline; filename=laporan_inventori.pdf'
    );

    doc.pipe(res);

    /* ================= HEADER ================= */
    doc.font('Helvetica-Bold')
      .fontSize(14)
      .text('LAPORAN DATA INVENTORI', { align: 'center' });

    doc.font('Helvetica')
      .fontSize(10)
      .text('Padukuhan V Tirtonirmolo', {
        align: 'center'
      });

    doc.font('Helvetica')
      .fontSize(10)
      .text(`Tanggal Cetak: ${dayjs().format('DD MMMM YYYY')}`, {
        align: 'center'
      });
    

    doc.moveDown(2);

    /* ================= TABEL HEADER ================= */
    const tableTop = doc.y;
    const colNo = 50;
    const colNama = 100;
    const colJumlah = 420;
    const rowHeight = 22;

    // Background header
    doc.rect(50, tableTop, 495, rowHeight).fill('#E5E7EB');

    doc.fillColor('#000')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('No', colNo, tableTop + 6)
      .text('Nama Barang', colNama, tableTop + 6)
      .text('Jumlah Total', colJumlah, tableTop + 6, { align: 'center' });

    // Garis bawah header
    doc.moveTo(50, tableTop + rowHeight)
      .lineTo(545, tableTop + rowHeight)
      .stroke();

    let y = tableTop + rowHeight;

    /* ================= ISI TABEL ================= */
    enriched.forEach((item, index) => {
      if (y > 750) {
        doc.addPage();
        y = 50;
      }

      doc.font('Helvetica').fontSize(10);

      doc.text(index + 1, colNo, y + 6);
      doc.text(item.nama_barang, colNama, y + 6, { width: 280 });
      doc.text(
        item.jumlah_total.toString(),
        colJumlah,
        y + 6,
        { align: 'center' }
      );

      // Garis baris
      doc.moveTo(50, y + rowHeight)
        .lineTo(545, y + rowHeight)
        .strokeColor('#CBD5E1')
        .stroke();

      y += rowHeight;
    });

    /* ================= FOOTER ================= */
    doc.moveDown(2);
    doc.font('Helvetica-Bold')
      .text(`Total Jenis Barang: ${enriched.length}`, { align: 'right' });

    doc.end();

  } catch (err) {
    res.status(500).json({
      message: 'Gagal mencetak inventori',
      error: err.message
    });
  }
};

/* ================= EXPORT ================= */

module.exports = {
  getAllInventories,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  pinjamInventori,
  kembalikanInventori,
  getActiveLoan,
  getAllLoansDipinjam,
  cetakInventori
};
