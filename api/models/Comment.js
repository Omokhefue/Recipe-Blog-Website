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
    likesCount: Number,
  },
  { timestamps: true }
);



CommentSchema.virtual("likes", {
  ref: "Likes", // Reference to the Likes model
  localField: "_id", // The field in the Recipe model that contains the reference
  foreignField: "parent", // The field in the Likes model to match against
});

CommentSchema.pre("deleteOne", async function (next) {
  const commentId = this.getQuery()["_id"];
  await mongoose
    .model("Likes")
    .deleteMany({ parent: commentId, parentType: "Comment" });
  next();
});

module.exports = mongoose.model("Comment", CommentSchema);
