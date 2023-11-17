const mongoose = require("mongoose");

const Transactionschema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId, ref: "Child",
      required: [true, "Please add a sender"],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId, ref: "Child",
      required: [true, "Please add a receiver"],
    },
    amount: {
      type: Number,
      required: [true, "Please add an amount"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", Transactionschema);
