// models/pengaduan.js
module.exports = (sequelize, DataTypes) => {
  const Pengaduan = sequelize.define(
    'Pengaduan',
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      judul: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isi: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      foto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      alamat_lokasi: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('dikirim', 'diproses', 'selesai', 'ditolak'),
        allowNull: false,
        defaultValue: 'dikirim',
      },
    },
    {
      tableName: 'pengaduans', // ⚠️ huruf kecil, konsisten
      timestamps: true,
      underscored: false,      // ✅ PENTING
    }
  );

  Pengaduan.associate = (models) => {
    Pengaduan.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
  };

  return Pengaduan;
};
