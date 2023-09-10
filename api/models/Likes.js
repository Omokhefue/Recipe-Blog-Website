const mongoose = require("mongoose");

const LikesSchema = new mongoose.Schema(
  {
    like: {
      type: Boolean,
      enum: [true],
    },
    author: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "parentType",
    },
    parentType: {
      type: String,
      required: true,
      enum: ["Recipe", "Comment"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Likes", LikesSchema);
