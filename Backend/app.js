const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('./cron/cekKeterlambatan');

// Mengimpor route
const authRoutes = require('./routes/authRoutes');
const pengaduanRoutes = require('./routes/pengaduanRoutes');
const adminRoutes = require('./routes/adminRoutes'); // ✅ tambahkan ini
const inventoryRoutes = require('./routes/inventoryRoutes');
const kegiatanRoutes = require('./routes/kegiatanRoutes');
const suratTemplateRoutes = require('./routes/suratTemplateRoutes');


// Mengimpor Sequelize models
const db = require('./models'); // ini akan otomatis memuat models/users.js & models/pengaduan.js

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handler
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Hapus salah satu penggunaan route /api/pengaduan
app.use('/api/pengaduan', pengaduanRoutes); // Gunakan ini saja
app.use('/api/inventory', inventoryRoutes);  // Pastikan route inventory sudah terdaftar
app.use('/api', kegiatanRoutes);
app.use('/api/surat', require('./routes/suratRoutes'));

// File upload statis
app.use('/uploads', express.static('uploads'));

app.use('/api/surat', suratTemplateRoutes);


// ✅ Tambahkan ini untuk mengizinkan akses ke folder public
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/surat_domisili', express.static(path.join(__dirname, 'public/surat_domisili')));



// Default route
app.get('/', (req, res) => {
  res.send('✅ Server Express berjalan di http://localhost:3000');
});

// Error handler: 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route tidak ditemukan' });
});

// Error handler: 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});

// Sinkronisasi database (pindahkan ini ke server.js kalau pakai cluster/production)
db.sequelize.sync()
  .then(() => {
    console.log('✅ Database Terkoneksi');
  })
  .catch((err) => {
    console.error('❌ Gagal sync database:', err);
  });

module.exports = app;
