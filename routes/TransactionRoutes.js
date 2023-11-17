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
router.route("/:id").post(internalTranaction);
router.route("/fromFather/:id").post(fromFather);



module.exports = router;
