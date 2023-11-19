const asyncHandler = require("express-async-handler");
const Child = require("../models/childModel");
const Goal = require("../models/goalModel");
const Transaction = require("../models/transactionModel");

// @desc    Get Goal
// @route   GET /api/Goal
// @access  Private
const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.find();
  res.status(200).json(transaction);
});

// @desc    Set Class
// @route   POST /api/class
// @access  Private
const setTransaction = asyncHandler(async (req, res) => {
  const { sender, receiver, amount } = req.body;
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
});

const internalTranaction = asyncHandler(async (req, res) => {
  let internalTranaction 
  const id = req.params.id;
  const { amount,from,to } = req.body;
       internalTranaction = await Child.findByIdAndUpdate(
      { _id: id },
      {
        $inc: {
          currentAccount: from === "currentAccount" ? -amount : amount,
          savingAccount: from === "currentAccount" ? amount : -amount,
        },
      },
      { new: true })
  res.status(200).json(internalTranaction);
});
const fromFather = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { amount } = req.body;
  const internalTranaction = await Child.findOneAndUpdate(
    { _id: id },
    { $inc: { currentAccount: amount } },
    { new: true }
  );
  res.status(200).json(internalTranaction);
});
module.exports = {
  getTransaction,
  setTransaction,
  internalTranaction,
  fromFather,
};
