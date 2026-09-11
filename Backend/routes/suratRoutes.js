const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const suratController = require('../controllers/suratController');

// ===== ADMIN: STATISTIK =====
router.get('/domisili/total', suratController.getTotalSurat);

// ===== USER =====
router.post('/domisili', auth, suratController.generateDomisili);
router.get('/domisili/user', auth, suratController.getSuratByUser);

// ===== ADMIN =====
router.get('/domisili', suratController.getAllSurat);
router.get('/domisili/:id', suratController.getDetailSurat);
router.put('/domisili/:id/terima', suratController.terimaSurat);
router.put('/domisili/:id/tolak', suratController.tolakSurat);
router.get('/domisili/:id/download', suratController.downloadSurat);

module.exports = router;
