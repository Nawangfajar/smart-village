const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

console.log('DB NAME:', process.env.DB_NAME);
console.log('DB HOST:', process.env.DB_HOST);


const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: false,
});

// ================= IMPORT MODEL =================
const UserModel = require('./users')(sequelize, DataTypes);
const PengaduanModel = require('./pengaduan')(sequelize, DataTypes);
const AdminModel = require('./admin')(sequelize, DataTypes);
const KegiatanModel = require('./kegiatan')(sequelize, DataTypes);
const SuratDomisiliModel = require('./SuratDomisili')(sequelize, DataTypes);
const InventoryModel = require('./Inventory');
const PeminjamanModel = require('./Peminjaman');

// ✅ TAMBAHKAN INI
const SuratTemplateModel = require('./suratTemplate')(sequelize, DataTypes);

// ================= RELASI =================
UserModel.hasMany(PengaduanModel, { foreignKey: 'user_id', onDelete: 'CASCADE' });
PengaduanModel.belongsTo(UserModel, { foreignKey: 'user_id' });

UserModel.hasMany(SuratDomisiliModel, { foreignKey: 'user_id', onDelete: 'CASCADE' });
SuratDomisiliModel.belongsTo(UserModel, { foreignKey: 'user_id' });

// INVENTORY & PEMINJAMAN
InventoryModel.hasMany(PeminjamanModel, { foreignKey: 'inventory_id', onDelete: 'CASCADE' });
PeminjamanModel.belongsTo(InventoryModel, { foreignKey: 'inventory_id' });

UserModel.hasMany(PeminjamanModel, { foreignKey: 'user_id', onDelete: 'CASCADE' });
PeminjamanModel.belongsTo(UserModel, { foreignKey: 'user_id' });

// ================= EXPORT DB =================
const db = {
  sequelize,
  Sequelize,
  User: UserModel,
  Pengaduan: PengaduanModel,
  Admin: AdminModel,
  Kegiatan: KegiatanModel,
  SuratDomisili: SuratDomisiliModel,
  SuratTemplate: SuratTemplateModel, // ✅ INI KUNCI UTAMA
  Inventory: InventoryModel,
  Peminjaman: PeminjamanModel,
};

module.exports = db;
