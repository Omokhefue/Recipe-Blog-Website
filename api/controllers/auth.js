// Import necessary modules and middleware.
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { processImageFile } = require("../utils/imageFileUpload");

// POST api/v1/auth/signup
// Register a user and send a verification email
// PUBLIC
exports.userSignUp = asyncHandler(async (req, res, next) => {
  let sanitizedImageName;

  // Extract email and password from the request body.
  const { email, password } = req.body;

  // Check if an image file is included in the request.
  if (req.files && req.files.image) {
    // Process and sanitize the image file.
    sanitizedImageName = await processImageFile(req, res, next, "users");
  }

  // Create a new user document in the database.
  const user = await User.create({
    image: sanitizedImageName,
    email,
    password,
    verifiedStatus: false,
  });

  // Generate and send a verification OTP email to the user.
  await user.getVerifyEmailOTP(user.email, res);

  // Send a JWT token in the response for successful sign-up.
  sendTokenResponse(user, 200, res);
});

// POST api/v1/auth/login
// Handle user login by verifying credentials (email and password).
// PUBLIC
exports.userLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Attempt to find the user and verify their password.
  const user = await User.login(email, password, next);

  // Send a JWT token in the response for successful login.
  sendTokenResponse(user, 200, res);
});

// POST api/v1/auth/forgot-password
// Handle the process of sending a password reset email to the user.
// PUBLIC
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // Find the user by their email address.
  const user = await User.findOne({ email: req.body.email });

  // If no user is found with the provided email, return an error response.
  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Generate a unique reset token and save it for the user.
  const resetToken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create the reset URL for the user to click on.
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/reset-password/${resetToken}`;

  // Create the email message with the reset URL.
  const message = `You are receiving this email because you need to reset your password. Please click on the following link to reset your password: \n\n ${resetURL}`;

  try {
    // Send the password reset email to the user.
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message,
    });
  } catch (err) {
    // If sending the email fails, clean up and return an error response.
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent"));
  }

  // Send a success response indicating that the email was sent.
  res.status(201).json({
    success: true,
    message: "Email sent",
    resetToken,
  });
});

// POST api/v1/auth//reset-password/:resetToken
// Handle resetting the user's password using a provided reset token.
// PRIVATE
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get the hashed token from the URL parameters.
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  // Find the user with a matching reset token and ensure it's not expired.
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // If no user is found or the token is expired, return an error response.
  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set the new password for the user.
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // Save the user's updated information.
  await user.save();

  // Send a success response with a new token to the user.
  sendTokenResponse(user, 200, res);
});

// POST api/v1/auth/logout
// Handle user logout by sending a success response.
// PRIVATE
exports.logout = asyncHandler(async (req, res, next) => {
  // Respond with a successful logout message.
  res.status(200).json({ message: "Logout successful" });
});

// POST api/v1/auth/verify-email
// Verify user email with OTP
// PRIVATE
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { email, userEnteredOTP } = req.body;

  // Find a user with the provided email, pending verification, and a valid OTP
  const user = await User.findOne({
    email,
    verifiedStatus: false,
    verifyEmailOTP: userEnteredOTP,
    verifyEmailOTPExpire: { $gt: Date.now() },
  });

  if (!user) {
    // If no user found or OTP data is missing, return an error response
    return next(new ErrorResponse("Invalid Token", 400));
  }

  // Proceed to verify the user's email
  await user.verifyEmail(user, userEnteredOTP, res);
});

// POST api/v1/auth/resend-otp
// Resend email verification OTP to the user
// PRIVATE
exports.resendVerifyEmailOTP = asyncHandler(async (req, res, next) => {
  const user = req.user;

  // Generate a new OTP and send it to the user's email
  await user.getVerifyEmailOTP(user.email);

  // Respond with a success message
  res.status(200).json({ success: true, message: "New OTP has been sent" });
});

/**
 * Send a JSON response containing a JWT token and user ID.
 *
 * @param {Object} user - The user object.
 * @param {number} statusCode - The HTTP status code for the response.
 * @param {Object} res - The response object.
 */
const sendTokenResponse = async (user, statusCode, res) => {
  // Generate a JWT token for the user
  const token = await user.getSignedJwtToken();

  // Send a JSON response with the generated token and user ID
  res.status(statusCode).json({
    success: true,
    token,
    user: user._id,
  });
};
