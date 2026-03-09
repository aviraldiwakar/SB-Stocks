const express = require('express');
const router = express.Router();
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/watchlist - Fetch the user's watchlist
router.get('/', authMiddleware, getWatchlist);

// POST /api/watchlist - Add a stock to the watchlist
router.post('/', authMiddleware, addToWatchlist);

// DELETE /api/watchlist/:stockId - Remove a stock from the watchlist
router.delete('/:stockId', authMiddleware, removeFromWatchlist);

module.exports = router;