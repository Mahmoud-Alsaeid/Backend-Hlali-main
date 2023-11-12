const mongoose = require("mongoose");

const childSchema = mongoose.Schema(
  {
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    dateBirth: {
      type: String,
      required: [true, "Please add a name"],
    },
    gender: {
      type: String,
      required: [false, "Please add a gender"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Child", childSchema);
