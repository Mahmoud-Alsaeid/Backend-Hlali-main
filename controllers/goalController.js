const asyncHandler = require("express-async-handler");
const Child = require("../models/childModel");
const Goal = require("../models/goalModel");
const {  createTransactionHistory } = require('./transaction-history');
// @desc    Get Goal
// @route   GET /api/Goal
// @access  Private
const getGoal = asyncHandler(async (req, res) => {
  const { id } = req.query;
  console.log(id);
  const Goals = await Goal.find({ childId: id });
  res.status(200).json(Goals);
});

// @desc    Set Class
// @route   POST /api/class
// @access  Private
const setGoal = asyncHandler(async (req, res) => {
  try {
    const { typeGoal, name, valueGoal, childId } = req.body;

    if (!name || !valueGoal || !childId) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    const Goals = await Goal.create({
      typeGoal,
      name,
      valueGoal,
      childId,
    });

    const child = await Child.findByIdAndUpdate(childId, {
      $push: { goal: Goals._id },
    });

    res.status(200).json(Goals);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }

  const Goals = await Goal.create({
    typeGoal,
    name,
    valueGoal,
    childId,
  });
  const child = await Child.findByIdAndUpdate(childId, {
    $push: { goal: Goals._id },
  });
  res.status(200).json(Goals);
});

// @desc    Update Goal
// @route   PUT /api/Goal/:id
// @access  Private
const updateGoal = asyncHandler(async (req, res) => {
  try {
    const Goals = await Goal.findById(req.params.id);

    if (!Goals) {
      res.status(404);
      throw new Error("Goal not found");
    }

    // Add validation checks for the fields you want to validate
    // For example, check if the updated data is valid before applying

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

const internalTransaction = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const { amount } = req.body;

    if (!amount) {
      res.status(400);
      throw new Error("Please provide the 'amount' field");
    }
    const ch = await Child.findById(id);



    const internalTransaction = await Child.findOneAndUpdate(
      { _id: id },
      { $inc: { currentAccount: -amount, savingAccount: amount } },
      { new: true }
    );
    
    

    res.status(200).json(internalTransaction);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

const updatedGoalValue = asyncHandler(async (req, res) => {
  try {
    const { amount, accountType } = req.body;

    if (!amount || !accountType) {
      res.status(400);
      throw new Error("Please provide 'amount' and 'accountType' fields");
    }

    const goal = await Goal.findById(req.params.id);

    const newGoal = await Goal.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { valueGoal: -amount } }
    );
    
    const fieldToUpdate =
      accountType === "currentAccount" ? "currentAccount" : "savingAccount";

    const internalTransaction = await Child.findOneAndUpdate(
      { _id: goal.childId },
      { $inc: { [fieldToUpdate]: -amount } },
      { new: true }
    );
    const ch = await Child.findById(req.params.id)
    await createTransactionHistory({
      title: newGoal.name,
      date: new Date(Date.now()).toLocaleString(
        "ar-SA",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      ),
      price: -amount,
      total: ch[fieldToUpdate],
      isCurrent: fieldToUpdate === 'currentAccount',
      user: goal.childId
    })
    res.status(200).json({ internalTransaction });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// @desc    Delete ypeClass
// @route   DELETE /api/Goal/:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
  try {
    const Goals = await Goal.findById(req.params.id);

    if (!Goals) {
      res.status(404);
      throw new Error("Goal not found");
    }

    await Goal.findOneAndDelete(Goals._id);

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = {
  getGoal,
  setGoal,
  updateGoal,
  deleteGoal,
  updatedGoalValue,
};
