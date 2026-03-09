const Portfolio = require('../models/Portfolio');

// Create new portfolio for logged-in user
exports.createPortfolio = async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne({ user: req.user.id });
        if (portfolio) {
            return res.status(400).json({ message: 'Portfolio already exists' });
        }

        // Creates portfolio
        portfolio = new Portfolio({ user: req.user.id });
        await portfolio.save();

        res.status(201).json(portfolio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating portfolio' });
    }
};

// Get logged-in user's portfolio
exports.getPortfolio = async (req, res) => {
    try {
        // .populate() pulls in the actual stock details
        const portfolio = await Portfolio.findOne({ user: req.user.id }).populate('holdings.stock');
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }
        res.json(portfolio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching portfolio' });
    }
};