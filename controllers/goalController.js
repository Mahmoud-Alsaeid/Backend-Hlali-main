const asyncHandler = require("express-async-handler");
const Child = require("../models/childModel");
const Goal = require("../models/goalModel");

// @desc    Get Goal
// @route   GET /api/Goal
// @access  Private
const getGoal = asyncHandler(async (req, res) => {
  const Goals = await Goal.find();
  res.status(200).json(Goals);
});

// @desc    Set Class
// @route   POST /api/class
// @access  Private
const setGoal = asyncHandler(async (req, res) => {
  const { typeGoal, name, valueGoal, childId } = req.body;

  // let user = await User.findById({req.user.id});

  // if (!user) {
  //   res.status(400);
  //   throw new Error("Please add a user field");
  // }
  if (!name) {
    res.status(400);
    throw new Error("Please add a text field");
  }

  const Goals = await Goal.create({
    parentId: req.user.id,
    typeGoal,
    name,
    valueGoal,
    childId,
  });
  const child = await Child.findByIdAndUpdate(childId, {
    $push: { goal: Goals._id }
  });
  res.status(200).json(Goals);
});

// @desc    Update Goal
// @route   PUT /api/Goal/:id
// @access  Private
const updateGoal = asyncHandler(async (req, res) => {
  const Goals = await Goal.findById(req.params.id);

  if (!Goals) {
    res.status(400);
    throw new Error("Class not found");
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedGoal);
});

const internalTranaction = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { amount } = req.body;
  const internalTranaction = await Child.findOneAndUpdate(
    { _id: id },
    { $inc: { currentAccount: -amount } },
    { $inc: { savingAccount: amount } },
    { new: true }
  );
  res.status(200).json(internalTranaction);
});

const updatedGoalValue = asyncHandler(async (req, res) => {
  const { amount, accountType } = req.body;
  const goal = await Goal.findById(req.params.id);
  await Goal.findOneAndUpdate(
    { _id: req.params.id },
    { $inc: { valueGoal: -amount } }
  );
  if (accountType == "currentAccount") {
    const internalTranaction = await Child.findOneAndUpdate(
      { _id: goal.childId },
      { $inc: { currentAccount: -amount } },
      { new: true }
    );
  } else {
    const internalTranaction = await Child.findOneAndUpdate(
      { _id: goal.childId },
      { $inc: { savingAccount: -amount } },
      { new: true }
    );
  }

  res.status(200).json({
    internalTranaction,
  });
});

// @desc    Delete ypeClass
// @route   DELETE /api/Goal/:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
  const Goal = await Goal.findById(req.params.id);

  if (!Goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  await Goal.findOneAndDelete(Goal._id);

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getGoal,
  setGoal,
  updateGoal,
  deleteGoal,
  updatedGoalValue,
};
