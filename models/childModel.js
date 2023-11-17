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
    savingAccount: {
      type: Number,
      default:0
    },
    currentAccount: {
      type: Number,
      default:0
    },
    goal: [{ type: mongoose.Schema.Types.ObjectId, ref: "Goal" , populate: true}],
    task: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" , populate: true}],
    requestTask: [{ 
      type: mongoose.Schema.Types.ObjectId,
       ref: "RequestTask" , 
       populate: true}],


  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Child", childSchema);
