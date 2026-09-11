const cron = require('node-cron');
const { Op } = require('sequelize');
const { Peminjaman, User, Inventory } = require('../models');
const admin = require('../config/firebase');
const dayjs = require('dayjs');

cron.schedule('0 8 * * *', async () => {
  console.log('⏰ Cek peminjaman terlambat...');

  const today = dayjs().format('YYYY-MM-DD');

  const data = await Peminjaman.findAll({
    where: {
      status: 'dipinjam',
      tanggal_sampai: { [Op.lt]: today }
    },
    include: [
      { model: User },
      { model: Inventory }
    ]
  });

  for (const item of data) {
    if (!item.User?.fcm_token) continue;

    await admin.messaging().send({
      token: item.User.fcm_token,
      notification: {
        title: 'Peminjaman Terlambat',
        body: `Peminjaman ${item.Inventory.nama_barang} sudah melewati batas waktu.`
      }
    });
  }
});
