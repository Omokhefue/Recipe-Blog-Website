const express = require("express");
const {
  userLogin,
  userSignUp,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerifyEmailOTP,
  logout,
} = require("../controllers/auth");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.post("/forgot-password", protect, forgotPassword);
router.post("/reset-password/:resetToken", protect, resetPassword);
router.post("/verify-email",protect, verifyEmail);
router.post("/resend-otp", protect, resendVerifyEmailOTP);
router.post("/logout", protect, logout);

module.exports = router;
