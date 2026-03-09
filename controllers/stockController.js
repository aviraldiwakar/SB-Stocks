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

// Add a new stock (Later, we can restrict this to 'admin' only)
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
        // We get the search term from the URL query (e.g., ?query=apple)
        const searchQuery = req.query.query; 

        if (!searchQuery) {
            return res.status(400).json({ message: 'Please provide a search term' });
        }

        // Search the database where the symbol OR the name matches the query
        // $options: 'i' makes the search case-insensitive
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