const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const Child = require("../models/childModel");

// @desc    Get Child
// @route   GET /api/Child
// @access  Private
const getChild = asyncHandler(async (req, res) => {
  try {
    const Childs = await Child.find();
    res.status(200).json(Childs);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

const getChildById = asyncHandler(async (req, res) => {
  try {
    const child = await Child.findById(req.params.id)
      .populate("goal")
      .populate("task")
      .populate("requestTask");

    if (!child) {
      res.status(404);
      throw new Error("Child not found");
    }

    const parentId = child.parentId;
    const brothers = await Child.find({ parentId });

    res.status(200).json({
      child,
      brothers,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// @desc    Set Class
// @route   POST /api/class
// @access  Private
const setChild = asyncHandler(async (req, res) => {
  try {
    const { name, dateBirth, gender } = req.body;

    if (!name || !dateBirth || !gender) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    const Childs = await Child.create({
      parentId: req.user.id,
      name,
      dateBirth,
      gender,
    });

    res.status(200).json(Childs);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const loginChild = asyncHandler(async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);

    if (child) {
      res.json({
        _id: child.id,
        name: child.name,
        userName: child.userName,
        token: generateToken(child._id),
      });
    } else {
      res.status(404);
      throw new Error("Child not found");
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// @desc    Update Child
// @route   PUT /api/Child/:id
// @access  Private
const updateChild = asyncHandler(async (req, res) => {
  try {
    const Childs = await Child.findById(req.params.id);

    if (!Childs) {
      res.status(404);
      throw new Error("Child not found");
    }

    // Add validation checks for the fields you want to validate
    // For example, check if the updated data is valid before applying

    const updatedChild = await Child.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedChild);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// @desc    Delete ypeClass
// @route   DELETE /api/Child/:id
// @access  Private
const deleteChild = asyncHandler(async (req, res) => {
  try {
    const Child = await Child.findById(req.params.id);

    if (!Child) {
      res.status(404);
      throw new Error("Child not found");
    }

    await Child.findOneAndDelete(Child._id);

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = {
  getChild,
  setChild,
  updateChild,
  deleteChild,
  loginChild,
  getChildById,
};
