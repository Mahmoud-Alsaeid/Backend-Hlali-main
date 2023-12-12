
const TransactionHistory = require('../models/transHistory');
const asyncHandler = require("express-async-handler");
const createTransactionHistory = async (body) => {
     await TransactionHistory.create(body);
}

const getTransactionHistories = asyncHandler ( async (req, res) => {
    const ts = await TransactionHistory.find({
        user: req.query.user,
        isCurrent: req.query.account === "current"
    })
    res.json(ts)
} )

module.exports ={
    createTransactionHistory,
    getTransactionHistories
}

