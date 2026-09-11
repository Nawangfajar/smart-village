const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

/* ================= CETAK (HARUS PALING ATAS) ================= */
router.get('/cetak', inventoryController.cetakInventori);

/* ================= CRUD DASAR ================= */
router.get('/', inventoryController.getAllInventories);
router.get('/:id', inventoryController.getInventoryById);
router.post('/', inventoryController.createInventory);
router.put('/:id', inventoryController.updateInventory);
router.delete('/:id', inventoryController.deleteInventory);

/* ================= PEMINJAMAN ================= */
router.post('/:id/borrow', inventoryController.pinjamInventori);
router.post('/:id/return', inventoryController.kembalikanInventori);
router.get('/:id/active-loan/:userId', inventoryController.getActiveLoan);
router.get('/loans/dipinjam', inventoryController.getAllLoansDipinjam);

module.exports = router;
