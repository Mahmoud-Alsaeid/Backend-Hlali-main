const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/halali";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(url, {});

    // console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
