const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authController = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', authController.loginAdmin);
router.post('/save-fcm-token', authController.saveFcmToken);


module.exports = router;
