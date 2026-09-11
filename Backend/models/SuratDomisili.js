// models/SuratDomisili.js
module.exports = (sequelize, DataTypes) => {
  const SuratDomisili = sequelize.define(
    'SuratDomisili',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nomor_surat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nik: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ttl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jenis_kelamin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      agama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pekerjaan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alamat_asal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alamat_domisili: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rw: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lama_menetap: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status_tempat_tinggal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      keperluan_surat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tempat_surat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tanggal_surat: {
        type: DataTypes.DATEONLY,
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
        allowNull: false,
      },
      catatan: {
        type: DataTypes.TEXT,
        defaultValue:
          'Catatan: Lampirkan fotokopi KTP/KK dan surat pengantar RT/RW jika diminta.',
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },

      // ✅ Kolom status untuk menandai proses surat
      status: {
        type: DataTypes.ENUM('Pending', 'Diterima', 'Ditolak'),
        allowNull: false,
        defaultValue: 'Pending',
      },

      // ✅ Kolom filePath untuk menyimpan path surat PDF (agar bisa di-download di Flutter)
      filePath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: 'surat_domisili',
    }
  );

  return SuratDomisili;
};
