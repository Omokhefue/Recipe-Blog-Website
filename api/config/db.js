const mongoose = require("mongoose");

const connectDB = async function () {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};
module.exports = connectDB;
