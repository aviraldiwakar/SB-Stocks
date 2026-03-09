const express = require('express');
const router = express.Router();
const { createPortfolio, getPortfolio } = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createPortfolio);
router.get('/', authMiddleware, getPortfolio);

module.exports = router;