const express = require("express");
const router = express.Router();
const {
  getUser,
  registerUser,
  loginUser,
  deleteUser,
  getMe,
  sendcode,
  newpass,
  configcode,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { handleMultipartData } = require("../Utils/Uploader");
router.get("/", getUser);
router.post("/", handleMultipartData, registerUser);
router.post("/login", loginUser);
router.delete("/:id", protect, deleteUser);
router.post("/sendcode", sendcode);
router.post("/newpass", newpass);
router.post("/configcode", configcode);
router.get("/me", protect, getMe);

module.exports = router;
