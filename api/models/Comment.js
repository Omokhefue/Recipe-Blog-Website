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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    likes: [
      {
        ref: "Likes",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    likesCount: Number,
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.comments || mongoose.model("Comment", CommentSchema);
