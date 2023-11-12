const mongoose = require("mongoose");

const requestTaskSchema = mongoose.Schema(
  {
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    typeTask: {
      type: String,
      required: [true, "Please add a name"],
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    valueTask: {
      type: String,
      required: [true, "Please add a name"],
    },

    finalTime: {
      type: String,
      required: [true, "Please add a name"],
    },

    childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RequestTask", requestTaskSchema);
