const asyncHandler = require("../middleware/async");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

// GET /api/categories/
// LIST OF CATEGORIES FOR DISPLAY ON HOMEPAGE
// PUBLIC
exports.getCategories = asyncHandler(async (req, res) => {
  const limit = 6;
  const categories = await Category.find().limit(limit);
  res.status(200).json(categories);
});

// GET /api/categories/categories
// ALL CATEGORIES
// PUBLIC
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
});

// GET /api/categories/:id
// SINGLE CATEGORY
// PUBLIC
exports.getRecipesByCategory = asyncHandler(async (req, res) => {
  const categoryName = req.params.category;
  const limit = 20;
  // displaying recipes categorized by category i.e country
  const recipeByCategory = await Recipe.find({ category: categoryName }).limit(
    limit
  );
  res.status(200).json(recipeByCategory);
});
