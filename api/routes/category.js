const express = require("express");
const {
  getCategories,
  getAllCategories,
  getRecipesByCategory,
} = require("../controllers/category");
const router = express.Router();

router.get("/", getCategories);
router.get("/categories", getAllCategories);
router.get("/:id", getRecipesByCategory);

module.exports = router;
