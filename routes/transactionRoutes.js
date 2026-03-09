const express = require('express');
const router = express.Router();
const { buyStock, sellStock } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/transactions/buy
router.post('/buy', authMiddleware, buyStock);

// POST /api/transactions/sell
router.post('/sell', authMiddleware, sellStock);

module.exports = router;