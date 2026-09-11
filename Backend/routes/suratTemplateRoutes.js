const express = require('express');
const router = express.Router();

const {
  getTemplate,
  updateTemplate,
} = require('../controllers/suratTemplateController');

// TANPA authAdmin dulu
router.get('/template', getTemplate);
router.put('/template', updateTemplate);

module.exports = router;
