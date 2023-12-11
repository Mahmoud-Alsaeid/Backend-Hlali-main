const asyncHandler = require("express-async-handler");
const Child = require("../models/childModel");
const User = require("../models/userModel");

const Task = require("../models/taskModel");
const taskModel = require("../models/taskModel");
const {createNotification} = require('./requestTaskController')
const getAllParentTasks = asyncHandler(async (req, res) => {
  try {
    const parentId = req.user.id;
    const Tasks = await Task.find({
      parentId: parentId,
      status: false,
    }).populate({
      path: "childId",

      select: {
        name: 1,
        gender: 1,
      },
    });
    res.status(200).json(Tasks);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

const getCompletedTask = asyncHandler(async (req, res) => {
  try {
    const Tasks = await Task.find({
      status: true,
      parentId: req.user.id,
    }).populate({
      path: "childId",
      select: {
        name: 1,
        gender: 1,
      },
    });
    res.status(200).json(Tasks);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

const getAllTasks = asyncHandler(async (req, res) => {
  try {
    const { id } = req.query;

    // Validate that 'id' is present in the query
    if (!id) {
      res.status(400);
      throw new Error("Please provide 'id' in the query");
    }

    const Tasks = await Task.find({ childId: id });
    res.status(200).json(Tasks);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

const getUnCompletedTask = asyncHandler(async (req, res) => {
  try {
    const Tasks = await Task.find({
      childId: req.query.childId,
      status: false,
    });
    res.status(200).json(Tasks);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

const setTask = asyncHandler(async (req, res) => {
  try {
    const { typeTask, name, time, childId, valueTask, desc } = req.body;

    if (!name || !childId || !valueTask || !desc) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    const existingChild = await Child.findById(childId);
    if (!existingChild) {
      res.status(400);
      throw new Error("Child not found");
    }

    const Tasks = await Task.create({
      parentId: req.user.id,
      typeTask,
      name,
      time,
      childId,
      valueTask,
      desc,
    });

    const child = await Child.findByIdAndUpdate(childId, {
      $push: { task: Tasks._id },
    });
    const user = await User.findByIdAndUpdate(Tasks.parentId, {
      $push: { task: Tasks._id },
    });

    res.status(200).json(Tasks);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

const updateTask = asyncHandler(async (req, res) => {
  try {
    const Tasks = await Task.findById(req.params.id);

    if (!Tasks) {
      res.status(400);
      throw new Error("Task not found");
    }

    // Add validation checks for the fields you want to validate
    // For example, check if the updated data is valid before applying

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

const EndTask = asyncHandler(async (req, res) => {
  try {
    const Tasks = await Task.findById(req.params.id);

    if (!Tasks) {
      res.status(400);
      throw new Error("Task not found");
    }

    /* const child = await Child.findByIdAndUpdate(Tasks.childId, {
      $inc: { currentAccount: Tasks.valueTask },
    }); */
    const childObj = await Child.findById(Tasks.childId)
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status: true },
      { new: true }
    );
    const word = childObj.gender === 'male' ? 'انجز' : 'انجزت'
    await createNotification({
      title: 'مهام طفلي',
      body: `${word} ${childObj.name} مهمة ${Tasks.name} بنجاح`,
      user: childObj.parentId
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.log({error})
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});
const FinishTask = asyncHandler(async (req, res) => {
  const Tasks = await Task.findById(req.params.id);
    const child = await Child.findByIdAndUpdate(Tasks.childId, {
      $inc: { currentAccount: Tasks.valueTask },
    }); 

    await Task.findByIdAndDelete(
      req.params.id
    );
})

const deleteTask = asyncHandler(async (req, res) => {
  try {
    const Task = await taskModel.findById(req.params.id);

    if (!Task) {
      res.status(400);
      throw new Error("Task not found");
    }

    await taskModel.findOneAndDelete(Task._id);

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = {
  getCompletedTask,
  setTask,
  updateTask,
  deleteTask,
  getUnCompletedTask,
  EndTask,
  getAllTasks,
  getAllParentTasks,
  FinishTask
};
