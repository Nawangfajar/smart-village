const express = require('express');
const router = express.Router();
const kegiatanController = require('../controllers/kegiatanController');

router.get('/kegiatan', kegiatanController.getRiwayatKegiatan);
router.get('/kegiatan/:id', kegiatanController.getKegiatanById);
router.post('/kegiatan', kegiatanController.uploadMiddleware, kegiatanController.buatKegiatan);
router.put('/kegiatan/:id', kegiatanController.uploadMiddleware, kegiatanController.updateKegiatan);
router.delete('/kegiatan/:id', kegiatanController.deleteKegiatan);

module.exports = router;
