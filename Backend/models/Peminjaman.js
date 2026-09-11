const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Peminjaman = sequelize.define('Peminjaman', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  inventory_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  jumlah_pinjam: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('dipinjam', 'dikembalikan'),
    defaultValue: 'dipinjam'
  },
  tanggal_pinjam: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  tanggal_sampai: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tanggal_kembali: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: false,
  tableName: 'peminjaman'
});

module.exports = Peminjaman;
