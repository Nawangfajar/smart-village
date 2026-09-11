// models/Kegiatan.js
module.exports = (sequelize, DataTypes) => {
  const Kegiatan = sequelize.define('Kegiatan', {
    nama_kegiatan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lokasi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    waktu: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  Kegiatan.associate = function(models) {
    // Relasi dengan model lain (jika ada)
  };

  return Kegiatan;
};
