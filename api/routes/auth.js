const User = require("../models/User");
const asyncHandler = require("../middleware/async");

exports.signup = asyncHandler(async (req, res, next) => {});
exports.login = asyncHandler(async (req, res, next) => {
  sendTokenResponse(user, 200, res);
});
