const asyncHandler = require("express-async-handler");
const Child = require("../models/childModel");
const Goal = require("../models/goalModel");
const Transaction = require("../models/transactionModel");
const cron = require('node-cron');
const {createNotification } = require('./requestTaskController');
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
      const ss = await Child.findById(sender)
    await createNotification({
      title: 'اخوتي',
      body: `حوالة واردة من ${ss.name}`,
      user: receiver
    });
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

 const cache = {};


const scheduleTransaction = async (fatherId, childId, day, amount) => {
  try {
    console.log({fatherId, childId, day, amount});
    const existingJob = cache?.[`${fatherId}_${childId}`];
    if (existingJob) {
      existingJob.stop();
    }

    const newJob = cron.schedule(`0 0 ${day} * *`, async () => {
      try {
        const internalTransaction = await Child.findOneAndUpdate(
          { _id: childId },
          { $inc: { currentAccount: amount } },
          { new: true }
        );

        console.log(`Transaction for day ${day}:`, internalTransaction);
      } catch (error) {
        console.error(error.message);
      }
    });

    // Save the new scheduled job to the object for later reference
    cache[`${fatherId}_${childId}`] = newJob;
  } catch (error) {
    console.error(error.message);
  }
};


const fromFather = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const { amount, day } = req.body;
    const parentId = req.user.id;
    if (!amount || !day) {
      res.status(400);
      throw new Error("Please provide both 'amount' and 'day' fields");
    }

    if (day < 1 || day > 27) {
      res.status(400);
      throw new Error("Invalid day. Day should be between 1 and 27.");
    }

    await scheduleTransaction(parentId, id, day, amount);

    res.status(200).json({ message: `Transaction scheduled for day ${day}` });
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
  cache
};
