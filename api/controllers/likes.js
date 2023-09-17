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

  // Call the addLike function to handle the like operation
  addLike(req, res, next, parent, parentType, user);
});

// POST api/v1/likes/comment/:CommentId
// Add a like to a comment.
// PUBLIC
exports.addCommentLike = asyncHandler((req, res, next) => {
  // Extract necessary data from the request
  const parent = req.resource; // The resource being liked (a comment)
  const parentType = "Comment"; // The type of the parent resource
  const user = req.user.id; // The user performing the like action

  // Call the addLike function to handle the like operation
  addLike(req, res, next, parent, parentType, user);
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
async function addLike(req, res, next, parent, parentType, user) {
  // Extract the 'like' data from the request body

  const { like } = req.body;

  // Populate the 'likes' field of the parent resource with 'user' data
  await parent.populate({
    path: "likes",
    select: "user",
  });

  // Check if the user has already liked the parent resource
  for (const existingLike of parent.likes) {
    if (existingLike.user.toString() === user) {
      return next(
        new ErrorResponse(
          `User ${req.user._id} cannot like ${parent._id} twice`,
          403
        )
      );
    }
  }

  // Create a new like in the database
  const newLike = await Likes.create({ like, parentType, parent, user });

  // Calculate the updated number of likes for the parent resource
  const numberOfLikes = Number(parent.likes.length) + 1;

  // Respond with the updated number of likes and the ID of the new like
  res.status(200).json({ likes: numberOfLikes, likeId: newLike._id });
}
