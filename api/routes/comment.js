const express = require("express");
const {
  addComment,
  deleteComment,
  getComments,
} = require("../controllers/comment");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { checkResourceExists } = require("../middleware/checkResourceExists");
const { checkAuthorization } = require("../middleware/checkAuthorization");

router.post("/", protect, addComment);
router.delete(
  "/:CommentId",
  protect,
  checkResourceExists("Comment"),
  checkAuthorization,
  deleteComment
);
router.get("/:RecipeId", getComments);
module.exports = router;
