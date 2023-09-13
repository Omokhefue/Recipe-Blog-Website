const express = require("express");
const {
  getAllUsers,
  getUser,
  userLogin,
  userSignUp,
  getLoggedIn,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  deleteUser,
} = require("../controllers/users");

const { protect } = require("../middleware/auth");
const { checkResourceExists } = require("../middleware/checkResourceExists");
const { checkAuthorization } = require("../middleware/checkAuthorisation");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/current-user", protect, getLoggedIn);
router.get("/:UserId", checkResourceExists("User"), getUser);
router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgot-password", protect, forgotPassword);
router.post("/reset-password/:resetToken", protect, resetPassword);
router.delete(
  "/:UserId",
  protect,
  checkResourceExists('User'),
  deleteUser
);

module.exports = router;
