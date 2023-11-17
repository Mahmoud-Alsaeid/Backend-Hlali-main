const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },

    gender: {
      type: String,
      required: [true, "Please add a gender"],
    },

    code: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    requestTask:[ { type: mongoose.Schema.Types.ObjectId, ref: "RequestTask" , populate: true}],
    task: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" , populate: true}],


  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
