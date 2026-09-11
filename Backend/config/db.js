// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Koneksi ke database menggunakan Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'layanan_masyarakat', // Nama database
  process.env.DB_USER || 'root',          // Username database
  process.env.DB_PASSWORD || '',          // Password database
  {
    host: process.env.DB_HOST || 'localhost', // Host database
    dialect: 'mysql',                       // Tipe database (mysql, postgres, sqlite, dll)
    port: process.env.DB_PORT || 3306,      // Port database
    logging: false,                         // Menonaktifkan log query SQL
  }
);

// Mengecek koneksi ke database
sequelize.authenticate()
  .then(() => {
    console.log('✅ Successfully connected to MySQL database');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });

module.exports = sequelize; // Ekspor koneksi Sequelize
