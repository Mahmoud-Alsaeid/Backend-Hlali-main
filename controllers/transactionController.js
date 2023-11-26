const asyncHandler = require("express-async-handler");
const Child = require("../models/childModel");
const Goal = require("../models/goalModel");
const Transaction = require("../models/transactionModel");

// @desc    Get Goal
// @route   GET /api/Goal
// @access  Private
const getTransaction = asyncHandler(async (req, res) => {
  try {
    const transaction = await Transaction.find();
    res.status(200).json(transaction);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// @desc    Set Class
// @route   POST /api/class
// @access  Private
const setTransaction = asyncHandler(async (req, res) => {
  try {
    const { sender, receiver, amount } = req.body;

    if (!sender || !receiver || !amount) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    await Child.findOneAndUpdate(
      { _id: sender },
      { $inc: { currentAccount: -amount } }
    );

    await Child.findByIdAndUpdate(
      { _id: receiver },
      { $inc: { currentAccount: amount } }
    );

    const transaction = await Transaction.create({
      sender,
      receiver,
      amount,
    });

    res.status(200).json(transaction);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

const internalTransaction = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const { amount, from, to } = req.body;

    if (!amount || !from || !to) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    let internalTransaction;

    internalTransaction = await Child.findByIdAndUpdate(
      { _id: id },
      {
        $inc: {
          currentAccount: from === "currentAccount" ? -amount : amount,
          savingAccount: from === "currentAccount" ? amount : -amount,
        },
      },
      { new: true }
    );

    res.status(200).json(internalTransaction);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

const fromFather = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const { amount } = req.body;

    if (!amount) {
      res.status(400);
      throw new Error("Please provide the 'amount' field");
    }

    const internalTransaction = await Child.findOneAndUpdate(
      { _id: id },
      { $inc: { currentAccount: amount } },
      { new: true }
    );

    res.status(200).json(internalTransaction);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = {
  getTransaction,
  setTransaction,
  internalTransaction,
  fromFather,
};
