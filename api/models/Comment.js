const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "say something..."],
    },
    user: {
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

CommentSchema.pre("deleteOne", async function (next) {
  const commentId = this.getQuery()["_id"];
  await mongoose
    .model("Likes")
    .deleteMany({ parent: commentId, parentType: "Comment" });
  next();
});

module.exports = mongoose.model("Comment", CommentSchema);
// mongoose.models.comments || mongoose.model("Comment", CommentSchema);
