module.exports = (sequelize, DataTypes) => {
  const SuratTemplate = sequelize.define(
    'SuratTemplate',
    {
      jenis_surat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nama_instansi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alamat_instansi: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      jabatan_pejabat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nama_pejabat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nip: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tempat_surat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      catatan_bawah: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'surat_templates', // 🔥 INI KUNCI UTAMA
      timestamps: true,
      underscored: false,
    }
  );

  return SuratTemplate;
};
