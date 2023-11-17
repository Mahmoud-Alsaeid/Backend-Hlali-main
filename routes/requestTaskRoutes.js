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

router.route("/").get(getRequestTask).post(protect, setRequestTask);
router
  .route("/:id")
  .delete(protect, deleteRequestTask)
  .put(protect, updateRequestTask)
  .get(approveRequestTask)
  

module.exports = router;
