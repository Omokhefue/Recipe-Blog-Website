const express = require("express");
const {
  addRecipeLike,
  deleteRecipeLike,
  addCommentLike,
  deleteCommentLike,
} = require("../controllers/likes");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { checkResourceExists } = require("../middleware/checkResourceExists");

router.post(
  "/recipe/:RecipeId",
  protect,
  checkResourceExists("Recipe"),
  addRecipeLike
);
router.post("/comment/:CommentId", protect, addCommentLike);
router.delete("/recipe/:likeId", protect, deleteRecipeLike);
router.delete("/comment/:likeId", protect, deleteCommentLike);

module.exports = router;
