// get all comments under a recipe - only show 10 at first
const Comment = require("../models/Comment");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

exports.addComment = asyncHandler(async (req, res, next) => {
  const { text, author, recipe, likes, likesCount } = req.body;
  let comment = await Comment.create({
    text,
    author,
    recipe,
    likes,
    likesCount,
  });
  await comment.populate({ path: "author", select: "name" });
  comment.likesCount = likes.length;

  res.status(200).json({
    comment: comment,
  });
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
  const commentId = req.params.id;

  await recipeNotFound(commentId, next);

  await Comment.deleteOne({ _id: commentId });

  return res.status(200).json({
    success: "deleted",
  });
});

async function recipeNotFound(commentId, next) {
  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    return next(new ErrorResponse("Recipe not found", 400));
  }
}
