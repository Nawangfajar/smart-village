'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Jika kolom latitude & longitude SUDAH ADA
    // migration ini dinonaktifkan agar tidak error ESM
  },

  async down(queryInterface, Sequelize) {
    // no-op
  },
};
