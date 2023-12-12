const mongoose = require('mongoose');

// Define the schema
const TransactionHistorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    isCurrent: {
        type: Boolean,
        default: true
    },
    user: {
        type: String,
    }
},
{
  timestamps: true,
}

);

const TransactionHistory = mongoose.model('TransactionHistory', TransactionHistorySchema);

module.exports = TransactionHistory
