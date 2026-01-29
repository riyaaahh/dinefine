const express = require('express');
const router = express.Router();
const { getTables, createTable, deleteTable } = require('../controllers/tableController');

router.get('/', getTables);
router.post('/', createTable);
router.delete('/:id', deleteTable);

module.exports = router;
