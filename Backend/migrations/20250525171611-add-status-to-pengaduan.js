'use strict';

module.exports = {
  up: async () => {
    // kolom status dan updatedAt sudah ada di database
    // migration ini dinonaktifkan untuk mencegah duplicate column
  },

  down: async () => {
    // tidak melakukan apa-apa
  }
};
