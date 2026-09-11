// routes/admin.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');  // pastikan destructuring


const JWT_SECRET = 'secret_jwt_key'; // Pastikan mengganti dengan secret yang lebih aman!

// Login Admin
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cari admin berdasarkan username
    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Periksa password dengan bcrypt
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Buat JWT token untuk admin
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, {
      expiresIn: '1h' // Token akan kadaluarsa dalam 1 jam
    });

    return res.status(200).json({ message: 'Login berhasil', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// Lihat semua pengaduan
router.get('/pengaduan', async (req, res) => {
  try {
    const pengaduanList = await Pengaduan.findAll(); // Ambil semua pengaduan dari database
    res.status(200).json(pengaduanList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil pengaduan', error: error.message });
  }
});

// Mengubah status pengaduan
router.put('/pengaduan/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Ambil status baru (Diproses, Selesai, Ditolak)

  try {
    // Cari pengaduan berdasarkan ID
    const pengaduan = await Pengaduan.findByPk(id);

    if (!pengaduan) {
      return res.status(404).json({ message: 'Pengaduan tidak ditemukan' });
    }

    // Perbarui status pengaduan
    pengaduan.status = status;
    await pengaduan.save();  // Simpan perubahan

    return res.status(200).json({
      message: 'Status pengaduan berhasil diperbarui',
      pengaduan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui status pengaduan', error: error.message });
  }
});

module.exports = router;

module.exports = router;
