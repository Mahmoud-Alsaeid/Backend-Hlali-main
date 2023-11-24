const asyncHandler = require("express-async-handler");
const Child = require("../models/childModel");
const RequestTask = require("../models/requestTask");
const User = require("../models/userModel");
const Task = require("../models/taskModel");

// @desc    Get Task
// @route   GET /api/Task
// @access  Private
const getRequestTask = asyncHandler(async (req, res) => {
  try {
    const RequestTasks = await RequestTask.find({}).populate({
      path: 'childId',
      select: {
        name: 1
      }
    });
    res.status(200).json(RequestTasks);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// @desc    Set Class
// @route   POST /api/class
// @access  Private
const setRequestTask = asyncHandler(async (req, res) => {
  try {
    const { typeTask, name, valueTask, time, childId, desc } = req.body;

    if (!name || !desc || !valueTask || !time || !childId) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    const childObj = await Child.findById(childId);
    const RequestTasks = await RequestTask.create({
      typeTask,
      name,
      desc,
      valueTask,
      time,
      childId,
    });

    const child = await Child.findByIdAndUpdate(childId, { $push: { requestTask: RequestTasks._id } });
    const user = await User.findByIdAndUpdate(childObj.parentId, { $push: { requestTask: RequestTasks._id } });

    res.status(200).json(RequestTasks);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// @desc    Update RequestTask
// @route   PUT /api/RequestTask/:id
// @access  Private
const updateRequestTask = asyncHandler(async (req, res) => {
  try {
    const RequestTasks = await RequestTask.findById(req.params.id);

    if (!RequestTasks) {
      res.status(404);
      throw new Error("RequestTask not found");
    }

    const updatedRequestTask = await RequestTask.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedRequestTask);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

const approveRequestTask = asyncHandler(async (req, res) => {
  try {
    const RequestTasks = await RequestTask.findById(req.params.id);

    if (!RequestTasks) {
      res.status(404);
      throw new Error("RequestTask not found");
    }

    const { desc, typeTask, name, valueTask, time, childId } = RequestTasks;
    const childOj = await Child.findById(childId);

    const Tasks = await Task.create({
      valueTask,
      typeTask,
      name,
      desc,
      time,
      childId,
      parentId: childOj.parentId
    });

    const child = await Child.findByIdAndUpdate(childId, { $push: { task: Tasks._id } });
    const user = await User.findByIdAndUpdate(Tasks.parentId, { $push: { task: Tasks._id } });

    await RequestTask.findByIdAndDelete(req.params.id);

    res.status(200).json(req.body);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// @desc    Delete ypeClass
// @route   DELETE /api/RequestTask/:id
// @access  Private
const deleteRequestTask = asyncHandler(async (req, res) => {
  try {
    const RequestTasks = await RequestTask.findById(req.params.id);

    if (!RequestTasks) {
      res.status(404);
      throw new Error("RequestTask not found");
    }

    await RequestTask.findOneAndDelete(RequestTasks._id);

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = {
  getRequestTask,
  setRequestTask,
  updateRequestTask,
  deleteRequestTask,
  approveRequestTask
};
