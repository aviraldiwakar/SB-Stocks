const Watchlist = require('../models/Watchlist');

// Get the user's watchlist
exports.getWatchlist = async (req, res) => {
    try {
        // Find the watchlist and populate the actual stock data
        let watchlist = await Watchlist.findOne({ user: req.user.id }).populate('stocks');
        
        if (!watchlist) {
            // If they don't have a watchlist yet, return an empty array
            return res.json({ stocks: [] });
        }
        
        res.json(watchlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching watchlist' });
    }
};

// Add a stock to the watchlist
exports.addToWatchlist = async (req, res) => {
    try {
        const { stockId } = req.body;

        let watchlist = await Watchlist.findOne({ user: req.user.id });

        // If a watchlist document doesn't exist for this user, create one
        if (!watchlist) {
            watchlist = new Watchlist({ user: req.user.id, stocks: [] });
        }

        // Check if the stock is already in the array so we don't add duplicates
        if (watchlist.stocks.includes(stockId)) {
            return res.status(400).json({ message: 'Stock already in watchlist' });
        }

        watchlist.stocks.push(stockId);
        await watchlist.save();

        res.status(200).json({ message: 'Stock added to watchlist!', watchlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error adding to watchlist' });
    }
};

// Remove a stock from the watchlist
exports.removeFromWatchlist = async (req, res) => {
    try {
        // Notice we get this from req.params (the URL), not req.body
        const stockId = req.params.stockId; 

        let watchlist = await Watchlist.findOne({ user: req.user.id });
        if (!watchlist) {
            return res.status(404).json({ message: 'Watchlist not found' });
        }

        // Filter out the stock ID that matches the one we want to remove
        watchlist.stocks = watchlist.stocks.filter(
            (id) => id.toString() !== stockId
        );

        await watchlist.save();
        res.status(200).json({ message: 'Stock removed from watchlist!', watchlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error removing from watchlist' });
    }
};