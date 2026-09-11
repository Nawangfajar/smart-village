// models/Inventory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_barang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jumlah: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  tipe_inventori: {
    type: DataTypes.ENUM('data', 'pinjam'),
    allowNull: false,
    defaultValue: 'data',
  },
}, {
  timestamps: true,
  tableName: 'inventories',
});

module.exports = Inventory;
