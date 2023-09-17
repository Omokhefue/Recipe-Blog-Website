const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { processImageFile } = require("../utils/imageFileUpload");

exports.userSignUp = asyncHandler(async (req, res, next) => {
  let sanitizedImageName;
  const { email, password } = req.body;

  if (req.files && req.files.image) {
    sanitizedImageName = await processImageFile(req, res, next, "users");
  }

  const user = await User.create({
    image: sanitizedImageName,
    email,
    password,
    verifiedStatus: false,
  });

  await user.getVerifyEmailOTP(user.email, res);

  sendTokenResponse(user, 200, res);
});
// done
exports.userLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.login(email, password, next);

  sendTokenResponse(user, 200, res);
}); // done
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
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent"));
  }
  res.status(201).json({
    success: true,
    message: "email sent",
    resetToken,
  });
});
// done
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

exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({ message: "Logout successful" });
});
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { email, userEnteredOTP } = req.body;
  const user = await User.findOne({
    email,
    verifiedStatus: false,
    verifyEmailOTP: userEnteredOTP,
    verifyEmailOTPExpire: { $gt: Date.now() },
  });
  if (!user) {
    // User not found or OTP data is missing
    return next(new ErrorResponse("Invalid Token", 400));
  }

  await user.verifyEmail(user, userEnteredOTP, res);
});

exports.resendVerifyEmailOTP = asyncHandler(async (req, res, next) => {
  const user = req.user;
  await user.getVerifyEmailOTP(user.email);
  res.status(200).json({ sucess: "true", message: "new otp has been sent" });
});

const sendTokenResponse = async (user, statusCode, res) => {
  const token = await user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: user._id,
  });
};
