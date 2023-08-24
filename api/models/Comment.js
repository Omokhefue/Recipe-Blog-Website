const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "say something..."],
    },
    author: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    recipe: {
      ref: "Recipe",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    likes: {
      ref: "Likes",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
