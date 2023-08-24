// get all users
// get single user - under user profile, show all recipes the user has, how the user email - if available
// add a user

const User = require("../models/User");
const asyncHandler = require("../middleware/async");

// exports.signup = asyncHandler(async (req, res, next) => {});
// exports.login = asyncHandler(async (req, res, next) => {
//   sendTokenResponse(user, 200, res);
// });

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = User.find();
});
exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = User.findOne(id).populate({
    path: "recipe",
    select: "title image",
  });
  res.status(200).json({ user });
});
exports.postUser = asyncHandler(async (req, res, next) => {
  const { name, image, email } = req.body;
  const users = User.create({ name, image, email });
  res.status(201).json({ users });
});
