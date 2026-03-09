const Portfolio = require('../models/Portfolio');

// Create a new portfolio for the logged-in user
exports.createPortfolio = async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne({ user: req.user.id });
        if (portfolio) {
            return res.status(400).json({ message: 'Portfolio already exists' });
        }

        // Creates portfolio with the default 100,000 balance from the schema
        portfolio = new Portfolio({ user: req.user.id });
        await portfolio.save();

        res.status(201).json(portfolio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating portfolio' });
    }
};

// Get the logged-in user's portfolio
exports.getPortfolio = async (req, res) => {
    try {
        // .populate() pulls in the actual stock details, not just the ID
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