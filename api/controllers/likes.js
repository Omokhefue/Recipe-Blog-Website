// get all comments under a recipe - only show 10 at first
const Likes = require("../models/Likes");
require("../models/Recipe");
require("../models/Comment");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// POST api/v1/likes/recipe/:RecipeId
// Add a like to a recipe.
// PUBLIC
exports.addRecipeLike = asyncHandler((req, res, next) => {
  // Extract necessary data from the request
  const parent = req.resource; // The resource being liked (a recipe)
  const parentType = "Recipe"; // The type of the parent resource
  const user = req.user.id; // The user performing the like action

  // Call the addRemoveLike function to handle the like operation
  addRemoveLike(req, res, next, parent, parentType, user);
});

// POST api/v1/likes/comment/:CommentId
// Add a like to a comment.
// PUBLIC
exports.addCommentLike = asyncHandler((req, res, next) => {
  // Extract necessary data from the request
  const parent = req.resource; // The resource being liked (a comment)
  const parentType = "Comment"; // The type of the parent resource
  const user = req.user.id; // The user performing the like action

  // Call the addRemoveLike function to handle the like operation
  addRemoveLike(req, res, next, parent, parentType, user);
});

// DELETE api/v1/likes/:LikesId
// Delete like from a comment or recipe
// PUBLIC
exports.deleteLike = asyncHandler(async (req, res, next) => {
  // Get the like ID from the request parameters
  const likeId = req.params.LikesId;

  // Delete the like from the database based on its ID
  await Likes.deleteOne({ _id: likeId });

  // Calculate the updated number of likes for the parent resource
  const numberOfLikes = await Likes.find({
    parent: req.resource.parent,
  }).countDocuments();

  // Respond with a success message and the updated number of likes
  res.status(200).json({ message: "Like deleted", likes: numberOfLikes });
});

// Add a like to a parent resource (recipe or comment).
async function addRemoveLike(req, res, next, parent, parentType, user) {
  let numberOfLikes;

  const { like } = req.body;

  await parent.populate({
    path: "likes",
    select: "user",
  });

  // Check if the user has already liked the parent resource
  const userHasLiked = parent.likes.some(
    (existingLike) => existingLike.user.toString() === user
  );

  if (userHasLiked) {
    // User has already liked, so remove the like
    await Likes.deleteOne({ user, parent, parentType });
    numberOfLikes = parent.likes.length - 1;
  } else {
    // User has not liked, so add the like
    await Likes.create({ like, parentType, parent, user });
    numberOfLikes = parent.likes.length + 1;
  }

  return res.status(200).json({ likes: numberOfLikes, parentId: parent._id });
}

