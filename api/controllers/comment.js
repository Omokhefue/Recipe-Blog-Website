// get all comments under a recipe - only show 10 at first
const Comment = require("../models/Comment");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

exports.addComment = asyncHandler(async (req, res, next) => {
  let { text, user, recipe } = req.body; // no likes and likesCount is sent from the frontend because there cannot be any like as the comment is just being create

  let comment = await Comment.create({
    text,
    user,
    recipe,
  });
  await comment.populate({ path: "user", select: "name" }); //add name of author to the comment being sent back

  res.status(200).json({
    comment: comment,
  });
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
  const commentId = req.params.CommentId;

 await Comment.deleteOne({ _id: commentId });

  return res.status(200).json({
    success: "deleted",
  });
});

