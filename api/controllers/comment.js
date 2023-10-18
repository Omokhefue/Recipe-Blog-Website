const Comment = require("../models/Comment");
require("../models/User");
const asyncHandler = require("../middleware/async");

// POST api/v1/comments/
// Add a new comment to a recipe.
// PRIVATE
exports.addComment = asyncHandler(async (req, res, next) => {
  // Extract comment data from the request body
  let { text, user, recipe } = req.body;

  // Create a new comment in the database
  let comment = await Comment.create({
    text,
    user,
    recipe,
  });

  // Populate the 'user' field of the comment with the 'name' property for the author
  await comment.populate({ path: "user", select: "name" });

  // Respond with the created comment, including the author's name
  res.status(200).json({
    comment: comment,
  });
});

// POST apI/v1/comments//:CommentId
// Delete a comment by its ID.
// PRIVATE
exports.deleteComment = asyncHandler(async (req, res, next) => {
  // Get the comment ID from the request parameters
  const commentId = req.params.CommentId;

  // Delete the comment from the database based on its ID
  await Comment.deleteOne({ _id: commentId });

  // Respond with a success message indicating that the comment has been deleted
  return res.status(200).json({
    success: "Comment deleted",
  });
});
exports.getComments = asyncHandler(async (req, res, next) => {
  const recipeId = req.params.RecipeId;

  // Fetch comments and populate the 'likes' field
  const comments = await Comment.find({ recipe: recipeId }).populate("likes");

  // Calculate 'likesCount' for each comment
  comments.forEach((comment) => {
    comment.likesCount = comment.likes?.length || 0;
  });
  console.log(comments);

  res.status(200).json({ comments });
});
