const asyncHandler = require("express-async-handler");
const Child = require("../models/childModel");
const RequestTask = require("../models/requestTask");
const User = require("../models/userModel");
const { setTask } = require("../controllers/taskController");
const Task = require("../models/taskModel")
// @desc    Get Task
// @route   GET /api/Task
// @access  Private
const getRequestTask = asyncHandler(async (req, res) => {
  const RequestTasks = await RequestTask.find({ status: false });
  res.status(200).json(RequestTasks);
});

// @desc    Set Class
// @route   POST /api/class
// @access  Private
const setRequestTask = asyncHandler(async (req, res) => {
  const { typeTask, name, valueTask, finalTime, childId,desc } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Please add a text field");
  }
  const RequestTasks = await RequestTask.create({
    parentId: req.user.id,
    typeTask,
    name,
    desc,
    valueTask,
    finalTime,
    childId,
  });
  const child = await Child.findByIdAndUpdate(childId, 
    { $push: { requestTask: RequestTasks._id } },  );
  const user = await User.findByIdAndUpdate(RequestTasks.parentId, 
    { $push: { requestTask: RequestTasks._id } },  );
  res.status(200).json(RequestTasks);
});
/*
  const childbefore = await Child.findById(childId)
  console.log(childbefore)
  const updateRequestTasks = await childbefore.requestTask.push(RequestTasks._id)
  console.log( await updateRequestTasks)
  const userBefore = await User.findById(RequestTasks.parentId)
  const updateUserRequestTasks = userBefore.requestTask.push(RequestTasks._id)*/ 
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
const approveRequestTask = asyncHandler(async (req, res) => {
  const RequestTasks = await RequestTask.findById(req.params.id);
  const {parentId, desc,typeTask, name, valueTask, finalTime, childId } = RequestTasks;

  /*parentId: req.user.id,
  typeTask,
  name,
  desc,
  time,
  childId,
  valueTask*/
  console.log(RequestTasks)
  const Tasks = await Task.create({
    parentId: parentId,
    valueTask: valueTask,
    typeTask: typeTask,
    name: name,
    desc: desc,
    time: finalTime,
    childId: childId,
  });
  const child = await Child.findByIdAndUpdate(childId,
    { $push: { task: Tasks._id } }  ) 
  const user = await User.findByIdAndUpdate(Tasks.parentId, 
    { $push: { task: Tasks._id } },  );
     await RequestTask.findByIdAndDelete(req.params.id);

  res.status(200).json(req.body);
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
  approveRequestTask
};
