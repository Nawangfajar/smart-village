const { Loan, Inventory } = require('../models');

// Pinjam Barang
exports.borrowItem = async (req, res) => {
  const { id } = req.params;  // ID barang
  const { userId, borrower_name, quantity } = req.body;  // Data peminjam dan jumlah

  try {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return res.status(404).json({ message: 'Barang tidak ditemukan' });

    if (inventory.jumlah < quantity) {
      return res.status(400).json({ message: 'Jumlah pinjam melebihi stok tersedia' });
    }

    // Kurangi stok barang
    inventory.jumlah -= quantity;
    await inventory.save();

    // Catat transaksi peminjaman
    await Loan.create({
      inventory_id: id,
      userId,
      borrower_name,
      quantity,
      status: 'BORROWED'
    });

    res.status(200).json({ message: 'Peminjaman berhasil' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Kembalikan Barang
exports.returnItem = async (req, res) => {
  const { id } = req.params;  // ID pinjaman

  try {
    const loan = await Loan.findByPk(id);
    if (!loan) return res.status(404).json({ message: 'Data pinjaman tidak ditemukan' });

    if (loan.status === 'RETURNED') {
      return res.status(400).json({ message: 'Barang sudah dikembalikan' });
    }

    // Ubah status pinjaman menjadi RETURNED
    loan.status = 'RETURNED';
    loan.return_date = new Date();
    await loan.save();

    // Tambah stok barang kembali
    const inventory = await Inventory.findByPk(loan.inventory_id);
    if (inventory) {
      inventory.jumlah += loan.quantity;
      await inventory.save();
    }

    res.json({ message: 'Barang berhasil dikembalikan' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};


