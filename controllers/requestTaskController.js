const asyncHandler = require("express-async-handler");

const RequestTask = require("../models/requestTask");

// @desc    Get Task
// @route   GET /api/Task
// @access  Private
const getRequestTask = asyncHandler(async (req, res) => {
  const RequestTasks = await RequestTask.find();
  res.status(200).json(RequestTasks);
});

// @desc    Set Class
// @route   POST /api/class
// @access  Private
const setRequestTask = asyncHandler(async (req, res) => {
  const { typeRequestTask, name, valueTask, finalTime, childId } = req.body;

  // let user = await User.findById({req.user.id});

  // if (!user) {
  //   res.status(400);
  //   throw new Error("Please add a user field");
  // }
  if (!name) {
    res.status(400);
    throw new Error("Please add a text field");
  }
  const RequestTasks = await RequestTask.create({
    parentId: req.user.id,
    typeRequestTask,
    name,
    valueTask,
    finalTime,
    childId,
  });

  res.status(200).json(RequestTasks);
});

// @desc    Update RequestTask
// @route   PUT /api/RequestTask/:id
// @access  Private
const updateRequestTask = asyncHandler(async (req, res) => {
  const RequestTasks = await RequestTask.findById(req.params.id);

  if (!RequestTasks) {
    res.status(400);
    throw new Error("Class not found");
  }

  const updatedRequestTask = await RequestTask.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json(updatedRequestTask);
});

// @desc    Delete ypeClass
// @route   DELETE /api/RequestTask/:id
// @access  Private
const deleteRequestTask = asyncHandler(async (req, res) => {
  const RequestTask = await RequestTask.findById(req.params.id);

  if (!RequestTask) {
    res.status(400);
    throw new Error("RequestTask not found");
  }

  await RequestTask.findOneAndDelete(RequestTask._id);

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getRequestTask,
  setRequestTask,
  updateRequestTask,
  deleteRequestTask,
};
