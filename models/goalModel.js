const mongoose = require("mongoose");

const goalSchema = mongoose.Schema(
  {
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    typeGoal: {
      type: Number,
      required: [true, "Please add a name"],
    },
    name: { 
      type: String,
      required: [true, "Please add a name"],
    },
    valueGoal: {
      type: Number,
      required: [true, "Please add a name"],
    },

    childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Goal", goalSchema);
