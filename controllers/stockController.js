const Stock = require('../models/Stock');

// Get all available stocks
exports.getAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.json(stocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching stocks' });
    }
};

// Add a new stock 
exports.addStock = async (req, res) => {
    try {
        const { symbol, name, currentPrice } = req.body;

        const newStock = new Stock({
            symbol,
            name,
            currentPrice
        });

        const savedStock = await newStock.save();
        res.status(201).json(savedStock);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error adding stock' });
    }
};

// Search stocks by symbol or name
exports.searchStocks = async (req, res) => {
    try {

        const searchQuery = req.query.query; 

        if (!searchQuery) {
            return res.status(400).json({ message: 'Please provide a search term' });
        }

        const stocks = await Stock.find({
            $or: [
                { symbol: { $regex: searchQuery, $options: 'i' } },
                { name: { $regex: searchQuery, $options: 'i' } }
            ]
        });

        res.json(stocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error searching stocks' });
    }
};