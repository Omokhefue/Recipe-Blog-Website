const express = require("express");
const {
  addRecipeLike,
  deleteRecipeLike,
  addCommentLike,
  deleteCommentLike,
} = require("../controllers/likes");
const router = express.Router();
const { protect } = require("../middleware/auth");

router.post("/recipe", protect, addRecipeLike);
router.post("/comment", protect, addCommentLike);
router.delete("/recipe/:likeId", protect, deleteRecipeLike);
router.delete("/comment/:likeId", protect, deleteCommentLike);

module.exports = router;
