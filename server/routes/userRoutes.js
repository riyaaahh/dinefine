const express = require('express');
const router = express.Router();
const { getStaff, createStaff, deleteStaff, loginUser } = require('../controllers/userController');

router.post('/login', loginUser);
router.get('/staff', getStaff);
router.post('/staff', createStaff);
router.delete('/staff/:id', deleteStaff);

module.exports = router;
