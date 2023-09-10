// get all users
// get single user - under user profile, show all recipes the user has, how the user email - if available
// add a user
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().populate({
    path: "recipes",
    select: "title",
  });

  res.status(200).json({ numberOfUsers: users.length, users });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.params;

  const user = await User.findById(userId).populate({
    path: "recipes",
    select: "title",
  });
  res.status(200).json({ numberOfrecipes: user.recipes.length, user });
});
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.params;

  await User.findByIdAndDelete(userId);
  res.status(200).json({ success: true, msg: "deleted" });
});

exports.userSignUp = asyncHandler(async (req, res, next) => {
  const { name, image, email, password } = req.body;
  const user = await User.create({ name, image, email, password });

  sendTokenResponse(user, 200, res);
});

exports.userLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.login(email, password, next);

  sendTokenResponse(user, 200, res);
});
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("there is no user with that email", 404));
  }

  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // create reset url
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `You are receiving this email because you need to confirm your email address. Please make a GET request to: \n\n ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(201).json({
      success: true,
      data: "email sent",
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent"));
  }
  res.status(201).json({
    success: true,
    user,
    resetToken,
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // set the new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  if (!name && !email) {
    return next(new ErrorResponse("no update details provided", 404));
  }
  const fieldsToUpdate = { name, email };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // Check current password
  const auth = await bcrypt.compare(req.body.currentPassword, user.password);

  if (!auth) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});
exports.getLoggedIn = asyncHandler(async (req, res, next) => {
  const user = await req.user.populate({
    path: "recipes",
    select: "title",
  });
  res.status(200).json({ userMe: user });
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.confirmEmail = asyncHandler(async (req, res, next) => {
  // grab token from email
  const { token } = req.query;

  if (!token) {
    return next(new ErrorResponse("Invalid Token", 400));
  }

  const splitToken = token.split(".")[0];
  const confirmEmailToken = crypto
    .createHash("sha256")
    .update(splitToken)
    .digest("hex");

  // get user by token
  const user = await User.findOne({
    confirmEmailToken,
    isEmailConfirmed: false,
  });

  if (!user) {
    return next(new ErrorResponse("Invalid Token", 400));
  }

  // update confirmed to true
  user.confirmEmailToken = undefined;
  user.isEmailConfirmed = true;

  // save
  user.save({ validateBeforeSave: false });

  // return token
  sendTokenResponse(user, 200, res);
});
// get token from model, create cookie and send response
const sendTokenResponse = async (user, statusCode, res) => {
  const token = await user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // if (process.env.NODE_ENV === "production") {
  //   options.secure = true
  // }
  res.status(statusCode).cookie("jwt", token, options).json({
    success: true,
    token,
    user: user._id,
  });
};
