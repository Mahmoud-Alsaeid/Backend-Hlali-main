const asyncHandler = require("express-async-handler");
const Child = require("../models/childModel");
const User = require("../models/userModel");

const Task = require("../models/taskModel");

// @desc    Get Task
// @route   GET /api/Task
// @access  Private
const getCompletedTask = asyncHandler(async (req, res) => {
  const Tasks = await Task.find({status:false});
  res.status(200).json(Tasks);
});

const getUnCompletedTask = asyncHandler(async (req, res) => {
  const Tasks = await Task.find({status:true});
  res.status(200).json(Tasks);
});

// @desc    Set Class
// @route   POST /api/class
// @access  Private
const setTask = asyncHandler(async (req, res) => {
  const { parentId, typeTask, name, desc, time, childId,valueTask } = req.body;

  // let user = await User.findById({req.user.id});

  // if (!user) {
  //   res.status(400);
  //   throw new Error("Please add a user field");
  // }
  if (!name) {
    res.status(400);
    throw new Error("Please add a text field");
  }
  const Tasks = await Task.create({
    parentId: req.user.id,
    typeTask,
    name,
    desc,
    time,
    childId,
    valueTask
  });
  const child = await Child.findByIdAndUpdate(childId,
    { $push: { task: Tasks._id } }  ) 
  const user = await User.findByIdAndUpdate(Tasks.parentId, 
    { $push: { task: Tasks._id } },  );
  res.status(200).json(Tasks);
});

// @desc    Update Task
// @route   PUT /api/Task/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const Tasks = await Task.findById(req.params.id);

  if (!Tasks) {
    res.status(400);
    throw new Error("Class not found");
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedTask);
});

const EndTask = asyncHandler(async (req, res) => {
  const Tasks = await Task.findById(req.params.id);

  if (!Tasks) {
    res.status(400);
    throw new Error("Class not found");
  }
  const child = await Child.findByIdAndUpdate(Tasks.childId,
    {$inc : {currentAccount : Tasks.valueTask }}
  )
  const updatedTask = await Task.findByIdAndUpdate(req.params.id,
     {status:true}, {
    new: true,
  });

  res.status(200).json(updatedTask);
});

// @desc    Delete ypeClass
// @route   DELETE /api/Task/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const Task = await Task.findById(req.params.id);

  if (!Task) {
    res.status(400);
    throw new Error("Task not found");
  }

  await Task.findOneAndDelete(Task._id);

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getCompletedTask,
  setTask,
  updateTask,
  deleteTask,
  getUnCompletedTask,
  EndTask
};