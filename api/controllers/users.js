const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const bcrypt = require("bcryptjs");
const { processImageFile, deleteImage } = require("../utils/imageFileUpload");

// POST api/v1/users/:UserId
// Update a user by its ID.
// PRIVATE
exports.updateDetails = asyncHandler(async (req, res, next) => {
  // Retrieve the user document based on the provided user ID.
  const user = await User.findById(req.params.UserId);

  // Extract name and email from the request body.
  const name = req.body.name;
  const email = req.body.email;

  // Check if no update details are provided (name, email, and files).
  if (!name && !email && !req.files) {
    return next(new ErrorResponse("No update details provided", 400));
  }

  // Initialize sanitizedImageName with the user's current image.
  let sanitizedImageName = user.image;

  // Check if a new image file is included in the request.
  if (req.files && req.files.image) {
    // Process the new image file and update sanitizedImageName.
    sanitizedImageName = await processImageFile(
      req,
      res,
      next,
      "users",
      sanitizedImageName
    );
  }

  // Create an object to store the fields to update.
  const fieldsToUpdate = {};

  // Check if the name is provided and add it to fieldsToUpdate.
  if (name) fieldsToUpdate.name = name;

  // Check if the email is provided and is different from the current email, then add it to fieldsToUpdate.
  if (email && email !== user.email) fieldsToUpdate.email = email;

  // Check if a new sanitized image name is available and add it to fieldsToUpdate.
  if (sanitizedImageName) fieldsToUpdate.image = sanitizedImageName;

  // Update the user's details and return the updated user.
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id, // Update the currently logged-in user.
    fieldsToUpdate, // Fields to update.
    {
      new: true, // Return the updated document.
      runValidators: true, // Run model validators.
    }
  );

  // Send a response with the updated user data.
  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

// POST api/v1/users/:UserId
// Update a users password
// PRIVATE
exports.updatePassword = asyncHandler(async (req, res, next) => {
  // Retrieve the user document based on the provided user ID and select the 'password' field.
  const user = await User.findById(req.params.UserId).select("+password");

  // Check if the user making the request is authorized to update the password.
  if (user.id !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to make changes to resource ${user._id}`,
        403
      )
    );
  }

  // Check if the provided current password matches the user's stored password.
  const auth = await bcrypt.compare(req.body.currentPassword, user.password);

  // If the current password is incorrect, send an error response.
  if (!auth) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  // Update the user's password with the new password and save the user document.
  user.password = req.body.newPassword;
  await user.save();

  // Send a response with the updated user and a new JWT token.
  sendTokenResponse(user, 200, res);
});

// GET api/v1/users/:UserId
// Get the currently logged in user by Id
// PRIVATE
exports.getLoggedIn = asyncHandler(async (req, res, next) => {
  // Retrieve the user document of the currently logged-in user using their ID.
  const user = await User.findById(req.user.id).populate({
    path: "recipes",
    select: "title",
  });

  // Send a JSON response with the user object.
  res.status(200).json({ userMe: user });
});
// GET api/v1/users/
// Get All Users
// PUBLIC
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  // Retrieve all user documents from the database.
  const users = await User.find().populate({
    path: "recipes",
    select: "title",
  });

  // Send a JSON response with the number of users and the user objects.
  res.status(200).json({ numberOfUsers: users.length, users });
});

// POST api/v1/users/:UserId
// Get a single user
// PUBLIC
exports.getUser = asyncHandler(async (req, res, next) => {
  // Extract the user's ID from the request parameters.
  const userId = req.params.UserId;

  // Retrieve the user document from the database based on the user's ID.
  const user = await User.findById(userId).populate({
    path: "recipes",
    select: "title",
  });

  // Send a JSON response with user details, including the number of recipes associated with the user.
  res.status(200).json({ numberOfrecipes: user.recipes.length, user });
});

// DELETE api/v1/users/:UserId
// delete a user
// PRIVATE
exports.deleteUser = asyncHandler(async (req, res, next) => {
  // Check if the authenticated user (req.user) is authorized to delete the resource.
  if (req.user.id.toString() !== req.params.UserId) {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to make changes to resource ${req.params.UserId}`,
        403
      )
    );
  }

  // Extract the user's ID from the request parameters.
  const userId = req.params.UserId;

  // Retrieve the user's image from the resource (assuming it's stored in the 'image' property).
  const userImage = req.resource.image;

  // Delete the user's image (assuming there's a function named 'deleteImage' that handles image deletion).
  await deleteImage("users", userImage);

  // Delete the user document from the database based on the user's ID.
  await User.deleteOne({ _id: userId });

  // Send a JSON response indicating a successful deletion.
  res.status(200).json({ success: true, msg: "deleted" });
});

//  * Send a JSON response with a token, success status, and user ID.
const sendTokenResponse = async (user, statusCode, res) => {
  // Generate a JSON Web Token (JWT) by calling the `getSignedJwtToken` method of the user object.
  const token = await user.getSignedJwtToken();

  // Set the HTTP status code, and send a JSON response with the token, success status, and user ID.
  res.status(statusCode).json({
    success: true,
    token,
    user: user._id, // Assuming the user object has an `_id` property.
  });
};
