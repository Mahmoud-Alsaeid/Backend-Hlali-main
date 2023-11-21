const express = require("express");
const router = express.Router();
const {
  getTransaction,
  setTransaction,
  internalTranaction,
  fromFather,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getTransaction).post(setTransaction);
router.route("/fromFather/:id").post(fromFather);
router.route("/:id").post(internalTranaction);

module.exports = router;
