const express = require('express');
const router = express.Router();
const { getAllStocks, addStock, searchStocks } = require('../controllers/stockController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// GET /api/stocks/search - Protected route to search stocks
router.get('/search', authMiddleware, searchStocks);

// GET /api/stocks - Protected route to get all stocks
router.get('/', authMiddleware, getAllStocks);

// POST /api/stocks - Admin ONLY route to add a stock
router.post('/', [authMiddleware, adminMiddleware], addStock);

module.exports = router;