const express = require("express");
const {
  getAllUsers,
  // getUser,
  userLogin,
  userSignUp,
  getLoggedIn,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/users");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getAllUsers);
router.get("/:id", protect, getLoggedIn);
// router.get("/:id", protect, getUser);
router.post("/signup", userSignUp);
router.post("/login", userLogin);        
router.put("/updatedetails",protect, updateDetails);        
router.put("/updatepassword",protect, updatePassword);        
router.post("/forgot-password",protect, forgotPassword);
router.post("/reset-password/:resetToken",protect, resetPassword);

module.exports = router;
