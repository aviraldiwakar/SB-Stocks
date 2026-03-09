const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

// Buy stock
exports.buyStock = async (req, res) => {
    try {

        const { stockId, quantity } = req.body;

        // Find stock and user's portfolio
        const stock = await Stock.findById(stockId);
        const portfolio = await Portfolio.findOne({ user: req.user.id });

        if (!stock || !portfolio) {
            return res.status(404).json({ message: 'Stock or Portfolio not found' });
        }

        // Calculate total cost
        const totalCost = stock.currentPrice * quantity;

        // Check if they have enough cash
        if (portfolio.virtualBalance < totalCost) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // Deduct funds and update holdings
        portfolio.virtualBalance -= totalCost;

        // Check if user already owns stock
        const holdingIndex = portfolio.holdings.findIndex(
            (item) => item.stock.toString() === stockId
        );

        if (holdingIndex > -1) {
            // Add to existing quantity
            portfolio.holdings[holdingIndex].quantity += quantity;
        } else {
            // Add new stock
            portfolio.holdings.push({ stock: stockId, quantity });
        }

        await portfolio.save();

        // Create transaction receipt
        const transaction = new Transaction({
            user: req.user.id,
            stock: stockId,
            type: 'buy',
            quantity,
            priceAtTransaction: stock.currentPrice
        });
        await transaction.save();

        res.status(201).json({ 
            message: 'Stock purchased successfully!', 
            balance: portfolio.virtualBalance 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during transaction' });
    }
};

// Sell stock
exports.sellStock = async (req, res) => {
    try {
        const { stockId, quantity } = req.body;

        const stock = await Stock.findById(stockId);
        const portfolio = await Portfolio.findOne({ user: req.user.id });

        if (!stock || !portfolio) {
            return res.status(404).json({ message: 'Stock or Portfolio not found' });
        }

        // Check if user owns stock
        const holdingIndex = portfolio.holdings.findIndex(
            (item) => item.stock.toString() === stockId
        );

        if (holdingIndex === -1 || portfolio.holdings[holdingIndex].quantity < quantity) {
            return res.status(400).json({ message: 'Not enough shares to sell' });
        }

        // Calculate earnings
        const totalEarnings = stock.currentPrice * quantity;

        // Add funds 
        portfolio.virtualBalance += totalEarnings;
        portfolio.holdings[holdingIndex].quantity -= quantity;

        // If all their shares are sold, remove from array
        if (portfolio.holdings[holdingIndex].quantity === 0) {
            portfolio.holdings.splice(holdingIndex, 1);
        }

        await portfolio.save();

        // Create transaction receipt
        const transaction = new Transaction({
            user: req.user.id,
            stock: stockId,
            type: 'sell',
            quantity,
            priceAtTransaction: stock.currentPrice
        });
        await transaction.save();

        res.status(200).json({ 
            message: 'Stock sold successfully!', 
            balance: portfolio.virtualBalance 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during sell transaction' });
    }
};