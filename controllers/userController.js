const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendemail = require("../Utils/sendMailer");
const childModel = require("../models/childModel");

// @desc    Get User
// @route   GET /api/user
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().populate('requestTask').populate('Task');
    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// @desc    Update user
// @route   PUT /api/user/:id
// @access  Private

// @desc    Delete User
// @route   DELETE /api/user/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(400);
      throw new Error("user not found");
    }
    await User.findOneAndDelete(user._id);
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/sendcode
// @access  Public
const sendcode = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    // Check for user email
    const user = await User.findOne({ email });
    if (user) {
      const send = await sendemail(email);
    } else {
      return res.status(404).send("not email1");
    }

    res.send("code sent your email");
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

const configcode = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

const newpass = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("not email1");
    }
    if (password.length < 7) {
      return res.status(404).send("not password");
    }

    let newPassword = bcrypt.hashSync(password, 10);
    await User.findByIdAndUpdate(user._id, {
      password: newPassword,
    });
    res.send("good new passowrd");
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  try {
    const id = req.user.id
  
    const user = req.user;
    const children = await  childModel.find({parentId: id})
    console.log({children});
    res.status(200).json({...user, firstTime: children.length === 0});
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
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
  deleteUser,
  getMe,
  sendcode,
  newpass,
  configcode,
};
