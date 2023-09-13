// get all comments under a recipe - only show 10 at first
const Likes = require("../models/Likes");
const Recipe = require("../models/Recipe");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

exports.addRecipeLike = asyncHandler((req, res, next) => {
  addLike(req, res, next);
});

exports.addCommentLike = asyncHandler((req, res, next) => {
  addLike(req, res, next);
});
exports.deleteRecipeLike = asyncHandler(async (req, res, next) => {
  deleteLike(req, res, next);
});
exports.deleteCommentLike = asyncHandler(async (req, res, next) => {
  deleteLike(req, res, next);
});

async function addLike(req, res, next) {
  const { like, parentType, parent, user } = req.body;
  const resource = req.resource;
  await resource.populate({
    path: "likes",
    select: "user",
  });
for (const like of resource.likes) {
  if (like.user.toString() === user) {
    return next(
      new ErrorResponse(
        `User ${req.user._id} cannot like ${resource._id} twice`,
        403
      )
    );
  }
}


  const newLike = await Likes.create({ like, parentType, parent, user });

  const numberOfLikes = await Likes.find({ parent: parent }).countDocuments();
  res.status(200).json({ likes: numberOfLikes, likeId: newLike._id });
}
async function deleteLike(req, res, next) {
  const likeId = req.params.likeId;

  const like = await Likes.findOne({ _id: likeId });
  console.log(like);
  await Likes.deleteOne({ _id: likeId });
  const numberOfLikes = await Likes.find({
    parent: like.parent,
  }).countDocuments();

  res.status(200).json({ likes: numberOfLikes });
}
