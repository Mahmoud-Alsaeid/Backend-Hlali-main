const express = require("express");
const router = express.Router();
const {
  getTask,
  setTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getTask).post(protect, setTask);
router.route("/:id").delete(protect, deleteTask).put(protect, updateTask);

module.exports = router;
