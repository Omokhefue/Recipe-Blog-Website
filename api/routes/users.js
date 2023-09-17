const express = require("express");
const {
  getAllUsers,
  getUser,
  getLoggedIn,
  updatePassword,
  deleteUser,
  updateDetails,
} = require("../controllers/users");

const { protect } = require("../middleware/auth");
const { checkResourceExists } = require("../middleware/checkResourceExists");
const { checkAuthorization } = require("../middleware/checkAuthorization");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/current-user", protect, getLoggedIn);
router.get("/:UserId", checkResourceExists("User"), getUser);
router.put(
  "/updatedetails/:UserId",
  protect,
  checkResourceExists("User"),
  updateDetails
);
router.put(
  "/updatepassword/:UserId",
  protect,
  checkResourceExists("User"),
  updatePassword
);
router.delete(
  "/:UserId",
  protect,
  checkResourceExists("User"),
  checkAuthorization,
  deleteUser
);

module.exports = router;
