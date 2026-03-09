const express = require('express');
const router = express.Router();
const { buyStock, sellStock } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/buy', authMiddleware, buyStock);

router.post('/sell', authMiddleware, sellStock);

module.exports = router;