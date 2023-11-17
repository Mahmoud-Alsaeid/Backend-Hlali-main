const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    typeTask: {
      type: Number,
      required: [true, "Please add a name"],
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    desc: {
      type: String,
      required: [true, "Please add a name"],
    },
    time: {
      type: String,
      required: [true, "Please add a name"],
    },
    valueTask : {
      type : Number,
    },
     status:{
      type:Boolean,
      default : false
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
