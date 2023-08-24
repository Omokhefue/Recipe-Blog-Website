// get all comments under a recipe - only show 10 at first

exports.getNumberOfLikes = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const likes = Likes.find({ recipe: id });
  res.status(200).json({ likes: likes.length });
  console.log(comments);
});
