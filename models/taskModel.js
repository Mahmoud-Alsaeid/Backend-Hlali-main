const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
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
    doc: {
      type: String,
      required: [true, "Please add a name"],
    },
    day: {
      type: String,
      required: [true, "Please add a name"],
    },
    time: {
      type: String,
      required: [true, "Please add a name"],
    },

    // childTask: {
    //   type: String,
    //   required: [true, "Please add a password"],
    // },
    childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
