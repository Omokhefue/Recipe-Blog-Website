// get all users
// get single user - under user profile, show all recipes the user has, how the user email - if available
// add a user
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { processImageFile, deleteImage } = require("../utils/imageFileUpload");

// done
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.UserId);

  const name = req.body.name;
  const email = req.body.email;

  if (!name && !email && !req.files) {
    return next(new ErrorResponse("No update details provided", 400));
  }

  let sanitizedImageName = user.image;
  if (req.files && req.files.image) {
    sanitizedImageName = await processImageFile(
      req,
      res,
      next,
      "users",
      sanitizedImageName
    );
  }

  // Construct fields to update
  const fieldsToUpdate = {};
  if (name) fieldsToUpdate.name = name;
  if (email && email !== user.email) fieldsToUpdate.email = email;
  if (sanitizedImageName) fieldsToUpdate.image = sanitizedImageName;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

// done
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.UserId).select("+password");

  if (user.id !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to make changes to resource ${user._id}`,
        403
      )
    );
  }

  // Check current password
  const auth = await bcrypt.compare(req.body.currentPassword, user.password);

  if (!auth) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});
// done
exports.getLoggedIn = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: "recipes",
    select: "title",
  });
  res.status(200).json({ userMe: user });
});

// done
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().populate({
    path: "recipes",
    select: "title",
  });

  res.status(200).json({ numberOfUsers: users.length, users });
});
// done
exports.getUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.UserId;

  const user = await User.findById(userId).populate({
    path: "recipes",
    select: "title",
  });

  res.status(200).json({ numberOfrecipes: user.recipes.length, user });
});

// done
exports.deleteUser = asyncHandler(async (req, res, next) => {
  if (req.user.id.toString() !== req.params.UserId) {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to make changes to resource ${req.params.UserId}`,
        403
      )
    );
  }
  const userId = req.params.UserId;

  const userImage = req.resource.image;

  await deleteImage("users", userImage);

  await User.deleteOne({ _id: userId });
  res.status(200).json({ success: true, msg: "deleted" });
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

  res.status(statusCode).json({
    success: true,
    token,
    user: user._id,
  });
};

