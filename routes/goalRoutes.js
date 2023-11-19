const express = require("express");
const router = express.Router();
const {
  getGoal,
  setGoal,
  updateGoal,
  deleteGoal,
  updatedGoalValue,

} = require("../controllers/goalController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getGoal).post(setGoal);
router.route("/:id").delete( deleteGoal).put(protect, updateGoal);
router.route("/updatedGoalValue/:id").put(updatedGoalValue);


module.exports = router;
