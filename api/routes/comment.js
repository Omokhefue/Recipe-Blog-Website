const express = require("express");
const { addComment, deleteComment } = require("../controllers/comment");
const router = express.Router();
const { protect } = require("../middleware/auth");

router.post("/", protect, addComment);
router.delete("/:id", protect, deleteComment);

module.exports = router;
