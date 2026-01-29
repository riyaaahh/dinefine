const express = require('express');
const router = express.Router();
const { getMenuItems, createMenuItem, seedMenu, deleteMenuItem, updateMenuItem } = require('../controllers/menuController');

router.get('/', getMenuItems);
router.post('/', createMenuItem);
router.post('/seed', seedMenu);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);

module.exports = router;
