const express = require('express');
const router = express.Router();
const controller = require('../controllers/pengaduanController');
const pengaduanController = require('../controllers/pengaduanController');

// Rute membuat pengaduan dengan upload foto
router.post('/', controller.uploadMiddleware, controller.buatPengaduan);

// Rute mengambil riwayat pengaduan berdasarkan user_id (untuk Flutter app)
router.get('/riwayat/:user_id', controller.getRiwayatPengaduanByUser);

// Rute mengambil semua pengaduan (untuk admin)
router.get('/riwayat', controller.getRiwayatPengaduanAll);
router.get('/tahun', pengaduanController.getDaftarTahunPengaduan);
router.get('/cetak/tahunan', pengaduanController.cetakPengaduanTahunan);
router.get('/statistik', pengaduanController.getStatistikPengaduanTahunan);



// Rute update status pengaduan
router.put('/updatestatus/:id', controller.updateStatus);

router.get('/cetak/tahunan', pengaduanController.cetakPengaduanTahunan);



module.exports = router;
