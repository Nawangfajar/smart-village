'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SuratTemplates', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      jenis_surat: { type: Sequelize.STRING, allowNull: false },
      nama_instansi: Sequelize.STRING,
      alamat_instansi: Sequelize.TEXT,
      jabatan_pejabat: Sequelize.STRING,
      nama_pejabat: Sequelize.STRING,
      nip: Sequelize.STRING,
      tempat_surat: Sequelize.STRING,
      catatan_bawah: Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('SuratTemplates');
  },
};
