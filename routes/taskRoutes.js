const express = require("express");
const router = express.Router();
const {
  getCompletedTask,
  setTask,
  updateTask,
  deleteTask,
  getUnCompletedTask,
  EndTask,
  getAllTasks,
  getAllParentTasks,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getAllTasks).post(protect, setTask);
router.route("/parentTasks/").get(protect, getAllParentTasks);

router.route("/notCmopletaed/").get(getUnCompletedTask);
router.route("/Cmopletaed/").get(protect, getCompletedTask);

//router.route("/allTasks/:id").get(getCompletedTask)

router.route("/:id").delete(protect, deleteTask).put(updateTask).get(EndTask);

module.exports = router;
