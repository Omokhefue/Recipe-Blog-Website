// get all comments under a recipe - only show 10 at first

exports.getAllComments = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const comments = Comment.find({ recipe: id });
  res.status(200).json({ comments });
  console.log(comments);
});
