// Import the Mongoose library for working with MongoDB.
const mongoose = require("mongoose");

// Define an asynchronous function to connect to the database.
const connectDB = async function () {
  try {
    // Attempt to connect to the MongoDB database using the URI stored in the environment variables.
    await mongoose.connect(process.env.MONGO_URI);

    // If the connection is successful, log a success message.
    console.log("Database connected!");
  } catch (error) {
    // If there's an error during connection, log the error and exit the process with an error code.
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

// Export the connectDB function so it can be used in other parts of the application.
module.exports = connectDB;
