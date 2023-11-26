const mongoose = require("mongoose");

// Define the bookmark schema
const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  { timestamps: true }
);



// Create a Mongoose model named "bookmark" using the schema
module.exports = mongoose.model("Bookmark", bookmarkSchema);
