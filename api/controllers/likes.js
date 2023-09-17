// get all comments under a recipe - only show 10 at first
const Likes = require("../models/Likes");
const Recipe = require("../models/Recipe");
const Comment = require("../models/Comment");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

exports.addRecipeLike = asyncHandler((req, res, next) => {
  const parent = req.resource;
  const parentType = "Recipe";
  const user = req.user.id;
  addLike(req, res, next, parent, parentType, user);
});

exports.addCommentLike = asyncHandler((req, res, next) => {
  const parent = req.resource;
  const parentType = "Comment";
  const user = req.user.id;
  addLike(req, res, next, parent, parentType, user);
});
exports.deleteLike = asyncHandler(async (req, res, next) => {
  const likeId = req.params.LikesId;
  await Likes.deleteOne({ _id: likeId });

  const numberOfLikes = await Likes.find({
    parent: req.resource.parent,
  }).countDocuments();

  res.status(200).json({ message: "deleted", likes: numberOfLikes });
});

async function addLike(req, res, next, parent, parentType, user) {
  const { like } = req.body;

  await parent.populate({
    path: "likes",
    select: "user",
  });

  for (const like of parent.likes) {
    if (like.user.toString() === user) {
      return next(
        new ErrorResponse(
          `User ${req.user._id} cannot like ${parent._id} twice`,
          403
        )
      );
    }
  }

  const newLike = await Likes.create({ like, parentType, parent, user });

  const numberOfLikes = Number(parent.likes.length) + 1;
  res.status(200).json({ likes: numberOfLikes, likeId: newLike._id });
}
