const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const Child = require("../models/childModel");

// @desc    Get Child
// @route   GET /api/Child
// @access  Private
const getChild = asyncHandler(async (req, res) => {
  const Childs = await Child.find();
  res.status(200).json(Childs);
});



const getChildById = asyncHandler(async (req,res)=> {
  const child = await Child.findById(req.params.id).populate('goal').populate('task').populate('RequestTask')
  const parentId = child.parentId
  const brothers = await Child.find({parentId})
  res.status(200).json({
    child,
    brothers})
})

// @desc    Set Class
// @route   POST /api/class
// @access  Private
const setChild = asyncHandler(async (req, res) => {
  const { name, dateBirth, gender } = req.body;

  // let user = await User.findById({req.user.id});

  // if (!user) {
  //   res.status(400);
  //   throw new Error("Please add a user field");
  // }
  if (!name && !dateBirth) {
    res.status(400);
    throw new Error("Please add a text field");
  }
  const Childs = await Child.create({
    parentId: req.user.id,
    name,
    dateBirth,
    gender,
  });

  res.status(200).json(Childs);
});


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}; 


const loginChild = asyncHandler(async (req, res) => {

  const child = await Child.findById(req.params.id);

  if (child) {
    res.json({
      _id: child.id,
      name: child.name,
      userName: child.userName,
      token: generateToken(child._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc    Update Child
// @route   PUT /api/Child/:id
// @access  Private
const updateChild = asyncHandler(async (req, res) => {
  const Childs = await Child.findById(req.params.id);

  if (!Childs) {
    res.status(400);
    throw new Error("Class not found");
  }

  const updatedChild = await Child.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedChild);
});

// @desc    Delete ypeClass
// @route   DELETE /api/Child/:id
// @access  Private
const deleteChild = asyncHandler(async (req, res) => {
  const Child = await Child.findById(req.params.id);

  if (!Child) {
    res.status(400);
    throw new Error("Child not found");
  }

  await Child.findOneAndDelete(Child._id);

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getChild,
  setChild,
  updateChild,
  deleteChild,
  loginChild,
  getChildById,
};
