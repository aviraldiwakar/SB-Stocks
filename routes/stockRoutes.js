const express = require('express');
const router = express.Router();
const { getAllStocks, addStock, searchStocks } = require('../controllers/stockController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// to search stocks
router.get('/search', authMiddleware, searchStocks);

// to get all stocks
router.get('/', authMiddleware, getAllStocks);

// to add a stock
router.post('/', [authMiddleware, adminMiddleware], addStock);

module.exports = router;