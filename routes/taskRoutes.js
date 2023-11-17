const express = require("express");
const router = express.Router();
const {
  getCompletedTask,
  setTask,
  updateTask,
  deleteTask,
  getUnCompletedTask,
  EndTask
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getCompletedTask).post(protect, setTask);
router.route("/notCmopletaed/").get(getUnCompletedTask)

router.route("/:id").delete(protect, deleteTask).put(protect, updateTask).get(protect,EndTask);

module.exports = router;
