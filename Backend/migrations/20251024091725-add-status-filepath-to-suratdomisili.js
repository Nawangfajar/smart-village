'use strict';

module.exports = {
  async up() {
    // kolom status dan filePath sudah ada di tabel SuratDomisilis
    // migration dinonaktifkan untuk mencegah duplicate column
  },

  async down() {
    // no-op
  },
};
