const express = require("express");
const router = express.Router();
const {
  getCompletedTask,
  setTask,
  updateTask,
  deleteTask,
  getUnCompletedTask,
  EndTask,
  getAllTasks
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect,getAllTasks).post(protect, setTask);
router.route("/notCmopletaed/").get(getUnCompletedTask)
router.route("/Cmopletaed/").get(protect,getCompletedTask)

//router.route("/allTasks/:id").get(getCompletedTask)

router.route("/:id").delete(protect, deleteTask).put(protect, updateTask).get(protect,EndTask);

module.exports = router;
