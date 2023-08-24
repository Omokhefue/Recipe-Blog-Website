const mongoose = require("mongoose");

const LikesSchema = new mongoose.Schema(
  {
    likes: {
      ref: "Likes",
      type: Number,
      defualt: 0,
      min: 0,
      max: 1,
    },
    author: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    recipe: {
      ref: "Recipe",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Likes", LikesSchema);
