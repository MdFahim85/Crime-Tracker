const DB = process.env.MONGO_URI;
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = mongoose.connect(DB);
    console.log("Database is connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = { connectDB };
