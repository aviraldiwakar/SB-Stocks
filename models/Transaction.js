const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
    type: { 
        type: String, 
        enum: ['buy', 'sell'], 
        required: true 
    },
    quantity: { type: Number, required: true },
    priceAtTransaction: { type: Number, required: true } // locking price at time of trade
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);