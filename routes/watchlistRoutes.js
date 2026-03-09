const express = require('express');
const router = express.Router();
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch user watchlist
router.get('/', authMiddleware, getWatchlist);

// Add stock to watchlist
router.post('/', authMiddleware, addToWatchlist);

// Remove stock from watchlist
router.delete('/:stockId', authMiddleware, removeFromWatchlist);

module.exports = router;