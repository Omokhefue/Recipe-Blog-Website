const asyncHandler = require("../middleware/async");
const Category = require("../models/Category");
const { deleteImage } = require("../utils/imageFileUpload");

// GET /api/categories/
// LIST OF CATEGORIES FOR DISPLAY ON HOMEPAGE
// PUBLIC
exports.getCategoriesForHomepage = asyncHandler(async (req, res) => {
  const categories = await Category.aggregate([{ $sample: { size: 3 } }]);
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
  const categoryId = req.params.CategoryId;

  const recipeByCategory = await Category.findById(categoryId)
    .populate("recipes")
    .exec();

  const recipes = recipeByCategory.recipes;

  res.status(200).json({ recipes });
});
exports.addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const sanitizedImageName = await processImageFile(req, res, next, "category");
  const user = req.user.id;
  const category = await Category.create({
    name,
    user,
    image: sanitizedImageName,
  });
  res.status(201).json(category);
});
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.CategoryId);

  let sanitizedImageName = category.image;
  if (req.files.image) {
    sanitizedImageName = await processImageFile(
      req,
      res,
      next,
      "category",
      sanitizedImageName
    );
  }
  const categoryToUpdate = req.resource.id;

  const updatedCategoryData = req.body;
  if (sanitizedImageName) {
    updatedCategoryData.image = sanitizedImageName;
  }
  if (Object.keys(updatedCategoryData).length === 0) {
    return next(new ErrorResponse("No update data provided", 400));
  }

  const updatedCategory = await Recipe.findByIdAndUpdate(
    categoryToUpdate,
    updatedCategoryData,
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, data: updatedCategory });
});
exports.deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.CategoryId;
  const categoryImage = req.resource.image;

  await deleteImage("users", categoryImage);
  await Category.deleteOne({ _id: categoryId });
  return res.status(200).json({ message: "deleted" });
});
