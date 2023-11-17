const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendemail = require("../Utils/sendMailer");

// @desc    Get User
// @route   GET /api/user
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  const users = await User.find().populate('requestTask').populate('Task');
  res.status(200).json(users);
});

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, gender, code } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    gender,
    code,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc    Update user
// @route   PUT /api/user/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, phone, bio, isAdmin, active, code } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error("user not found");
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Make sure the logged in user matches the member user
  // if (user.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error("User not authorized");
  // }

  const fileName = req.file.originalname;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      name,
      email,
      phone,
      bio,
      isAdmin,
      active,
      code,
      image: `${basePath}${fileName}`,
    },

    {
      new: true,
    }
  );

  res.status(200).json(updatedUser);
});
// @desc    Delete User
// @route   DELETE /api/user/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error("user not found");
  }
  await User.findOneAndDelete(user._id);
  res.status(200).json({ id: req.params.id });
});

// @desc    Authenticate a user
// @route   POST /api/users/sendcode
// @access  Public
const sendcode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check for user email
  const user = await User.findOne({ email });
  if (user) {
    const send = await sendemail(email);
  } else {
    return res.status(404).send("not email1");
  }

  res.send("code sent your email");
});

const configcode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check for user email
  let user = await User.findOne({ email });
  let code = user.code;
  if (code === req.body.code) {
    return res.send("good code");
  } else {
    res.send("not good code");
  }

  res.send("good code");
});

const newpass = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("not email1");
  }
  if (password < 7) {
    return res.status(404).send("not password");
  }

  let newPassword = bcrypt.hashSync(password, 10);
  await User.findByIdAndUpdate(user._id, {
    password: newPassword,
  });
  res.send("good new passowrd");
});
// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  getUser,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getMe,
  sendcode,
  newpass,
  configcode,
};
