const express = require("express");
const router = express.Router();
const {
  getTransaction,
  setTransaction,
  internalTransaction,
  fromFather,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getTransaction).post(setTransaction);
router.route("/fromFather/:id").post(fromFather);
router.route("/:id").post(internalTransaction);

module.exports = router;
