const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true }, 
    name: { type: String, required: true },
    currentPrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);