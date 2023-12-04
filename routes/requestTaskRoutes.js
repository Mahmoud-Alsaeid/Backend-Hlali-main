const express = require("express");
const router = express.Router();
const {
  getRequestTask,
  setRequestTask,
  updateRequestTask,
  deleteRequestTask,
  approveRequestTask
} = require("../controllers/requestTaskController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getRequestTask).post(setRequestTask);
router
  .route("/:id")
  .delete( deleteRequestTask)
  .put(protect, updateRequestTask)
  .get(approveRequestTask)
  

module.exports = router;
