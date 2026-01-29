const express = require('express');
const router = express.Router();
const { getSalesStats } = require('../controllers/reportController');

router.get('/sales', getSalesStats);

module.exports = router;
