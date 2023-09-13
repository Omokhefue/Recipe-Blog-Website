const express = require("express");
const {
  getCategories,
  getAllCategories,
  getRecipesByCategory,
} = require("../controllers/category");
const router = express.Router();
const { protect } = require("../middleware/auth");

router.get("/", protect, getCategories);
router.get("/categories", protect, getAllCategories);
router.get("/:id", protect, getRecipesByCategory);

// add route to add categories. only for the admin
module.exports = router;
