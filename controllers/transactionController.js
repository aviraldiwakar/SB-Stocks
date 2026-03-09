const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

// Buy a stock
exports.buyStock = async (req, res) => {
    try {
        // We expect the frontend to send us the Stock ID and how many they want
        const { stockId, quantity } = req.body;

        // 1. Find the stock and the user's portfolio
        const stock = await Stock.findById(stockId);
        const portfolio = await Portfolio.findOne({ user: req.user.id });

        if (!stock || !portfolio) {
            return res.status(404).json({ message: 'Stock or Portfolio not found' });
        }

        // 2. Calculate the total cost
        const totalCost = stock.currentPrice * quantity;

        // 3. Check if they have enough virtual cash
        if (portfolio.virtualBalance < totalCost) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // 4. Deduct the funds and update holdings
        portfolio.virtualBalance -= totalCost;

        // Check if user already owns this stock
        const holdingIndex = portfolio.holdings.findIndex(
            (item) => item.stock.toString() === stockId
        );

        if (holdingIndex > -1) {
            // Add to existing quantity
            portfolio.holdings[holdingIndex].quantity += quantity;
        } else {
            // Add new stock to holdings
            portfolio.holdings.push({ stock: stockId, quantity });
        }

        await portfolio.save();

        // 5. Create the transaction receipt
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

// Sell a stock
exports.sellStock = async (req, res) => {
    try {
        const { stockId, quantity } = req.body;

        const stock = await Stock.findById(stockId);
        const portfolio = await Portfolio.findOne({ user: req.user.id });

        if (!stock || !portfolio) {
            return res.status(404).json({ message: 'Stock or Portfolio not found' });
        }

        // 1. Check if the user actually owns this stock
        const holdingIndex = portfolio.holdings.findIndex(
            (item) => item.stock.toString() === stockId
        );

        if (holdingIndex === -1 || portfolio.holdings[holdingIndex].quantity < quantity) {
            return res.status(400).json({ message: 'Not enough shares to sell' });
        }

        // 2. Calculate earnings
        const totalEarnings = stock.currentPrice * quantity;

        // 3. Add funds to balance and deduct shares
        portfolio.virtualBalance += totalEarnings;
        portfolio.holdings[holdingIndex].quantity -= quantity;

        // If they sold all their shares of this stock, remove it from the array
        if (portfolio.holdings[holdingIndex].quantity === 0) {
            portfolio.holdings.splice(holdingIndex, 1);
        }

        await portfolio.save();

        // 4. Create the transaction receipt
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