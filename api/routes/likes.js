const express = require("express");
const {
  addRecipeLike,
  addCommentLike,
  deleteLike,
} = require("../controllers/likes");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { checkResourceExists } = require("../middleware/checkResourceExists");
const { checkAuthorization } = require("../middleware/checkAuthorization");

router.post(
  "/recipe/:RecipeId",
  protect,
  checkResourceExists("Recipe"),
  addRecipeLike
);
router.post(
  "/comment/:CommentId",
  protect,
  checkResourceExists("Comment"),
  addCommentLike
);
router.delete(
  "/:LikesId",
  protect,
  checkResourceExists("Likes"),
  checkAuthorization,
  deleteLike
);

module.exports = router;
