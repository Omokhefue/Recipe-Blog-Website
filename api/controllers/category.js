const asyncHandler = require("../middleware/async");
const Category = require("../models/Category");
const { deleteImage } = require("../utils/imageFileUpload");

// GET api/v1/categories/homepage
// Get a random selection of categories for displaying on the homepage.
// PUBLIC
exports.getCategoriesForHomepage = asyncHandler(async (req, res) => {
  // Retrieve a random selection of categories (e.g., for featured categories on the homepage)
  const categories = await Category.aggregate([{ $sample: { size: 3 } }]);

  // Send a JSON response with the selected categories
  res.status(200).json(categories);
});

// GET api/v1/categories/
// Get a paginated list of categories.
// PUBLIC
exports.getAllCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the requested page number
  const limit = 5; // Number of categories per page

  // Calculate the skip value to skip categories on previous pages
  const skip = (page - 1) * limit;

  // Query the database to get a paginated list of categories
  const categories = await Category.find().skip(skip).limit(limit);

  // Send the paginated list of categories as a JSON response
  res.status(200).json(categories);
});

// GET api/v1/categories/:CategoryId
// Get a recipes related to a specified category
// PUBLIC
exports.getRecipesByCategory = asyncHandler(async (req, res) => {
  // Extract the categoryId from the request parameters
  const categoryId = req.params.CategoryId;

  // Query the database to find the category by its ID and populate its recipes
  const recipeByCategory = await Category.findById(categoryId)
    .populate("recipes")
    .exec();

  // Extract the recipes associated with the category
  const recipes = recipeByCategory.recipes;

  // Send the recipes as a JSON response
  res.status(200).json({ recipes });
});

// POST api/v1/categories/
// Add a new category.
// PRIVATE ADMIN
exports.addCategory = asyncHandler(async (req, res) => {
  // Extract the 'name' from the request body
  const { name } = req.body;

  // Process and sanitize the image file associated with the category
  const sanitizedImageName = await processImageFile(req, res, next, "category");

  // Get the user ID from the authenticated user's request
  const user = req.user.id;

  // Create a new category record in the database
  const category = await Category.create({
    name,
    user,
    image: sanitizedImageName,
  });

  // Send a JSON response with the newly created category
  res.status(201).json(category);
});

// PUT api/v1/categories/:CategoryId
// Update a category by its ID.
// PUBLIC

exports.updateCategory = asyncHandler(async (req, res) => {
  // Find the category by its ID
  const category = await Category.findById(req.params.CategoryId);

  // Initialize the sanitized image name with the existing category's image
  let sanitizedImageName = category.image;

  // Check if a new image file is provided in the request
  if (req.files.image) {
    // If a new image is provided, process and sanitize it, then update the sanitized image name
    sanitizedImageName = await processImageFile(
      req,
      res,
      next,
      "category",
      sanitizedImageName
    );
  }

  // Get the ID of the category to be updated
  const categoryToUpdate = req.params.CategoryId;

  // Get the updated category data from the request body
  const updatedCategoryData = req.body;

  // If a new image was processed, update the image property in the updated data
  if (sanitizedImageName) {
    updatedCategoryData.image = sanitizedImageName;
  }

  // Check if any update data is provided
  if (Object.keys(updatedCategoryData).length === 0) {
    return next(new ErrorResponse("No update data provided", 400));
  }

  // Update the category in the database and retrieve the updated category
  const updatedCategory = await Category.findByIdAndUpdate(
    categoryToUpdate,
    updatedCategoryData,
    { new: true, runValidators: true }
  );

  // Send a JSON response with the updated category
  res.status(200).json({ success: true, data: updatedCategory });
});

// DELETE api/v1/categories/:CategoryId
// Delete a category by its ID.
// PUBLIC
exports.deleteCategory = asyncHandler(async (req, res) => {
  // Get the category ID from the request parameters
  const categoryId = req.params.CategoryId;

  // Get the category's image filename from the resource
  const categoryImage = req.resource.image;

  // Delete the category's image file from storage. deleteImage is a function for file deletion
  await deleteImage("users", categoryImage);

  // Delete the category from the database based on its ID
  await Category.deleteOne({ _id: categoryId });

  // Respond with a success message indicating that the category has been deleted
  return res.status(200).json({ message: "Category deleted" });
});
