const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    virtualBalance: { 
        type: Number, 
        default: 100000 // for demo
    },
    holdings: [{
        stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
        quantity: { type: Number, required: true, default: 0 }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);