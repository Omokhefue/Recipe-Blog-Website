// get all comments under a recipe - only show 10 at first
const Likes = require("../models/Likes");
const asyncHandler = require("../middleware/async");

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
  const { like, parentType, parent, author } = req.body;
  const newLike = await Likes.create({ like, parentType, parent, author });

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
