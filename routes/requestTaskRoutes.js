const express = require("express");
const router = express.Router();
const {
  getRequestTask,
  setRequestTask,
  updateRequestTask,
  deleteRequestTask,
} = require("../controllers/requestTaskController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getRequestTask).post(protect, setRequestTask);
router
  .route("/:id")
  .delete(protect, deleteRequestTask)
  .put(protect, updateRequestTask);

module.exports = router;
