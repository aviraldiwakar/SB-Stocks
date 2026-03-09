const Watchlist = require('../models/Watchlist');

// Get user's watchlist
exports.getWatchlist = async (req, res) => {
    try {
        // Find the watchlist and populate the actual stock data
        let watchlist = await Watchlist.findOne({ user: req.user.id }).populate('stocks');
        
        if (!watchlist) {
            // If no watchlist yet, return an empty array
            return res.json({ stocks: [] });
        }
        
        res.json(watchlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching watchlist' });
    }
};

// Adding stock
exports.addToWatchlist = async (req, res) => {
    try {
        const { stockId } = req.body;

        let watchlist = await Watchlist.findOne({ user: req.user.id });

        // If no watchlist document is there, create one
        if (!watchlist) {
            watchlist = new Watchlist({ user: req.user.id, stocks: [] });
        }

        // Checking stock is already in array
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

// Remove stock from watchlist
exports.removeFromWatchlist = async (req, res) => {
    try {

        const stockId = req.params.stockId; 

        let watchlist = await Watchlist.findOne({ user: req.user.id });
        if (!watchlist) {
            return res.status(404).json({ message: 'Watchlist not found' });
        }

        // Filter out stock ID that we want to remove
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