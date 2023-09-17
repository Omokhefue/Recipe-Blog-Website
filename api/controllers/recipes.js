const asyncHandler = require("../middleware/async");
require("../models/Category");
require("../models/User");
require("../models/Likes");
const Recipe = require("../models/Recipe");
require("../models/Comment");
const ErrorResponse = require("../utils/errorResponse");
const { processImageFile, deleteImage } = require("../utils/imageFileUpload");

// GET api/vi/recipes/latest
// LIST OF RECENTLY ADDED RECIPES
// PUBLIC done
exports.getLatestRecipes = asyncHandler(async (req, res) => {
  const limit = 6;
  const latest = await Recipe.find().sort({ createdAt: -1 }).limit(limit);
  res.status(200).json(latest);
});
// GET api/vi/recipes/:id
// SINGLE Recipe
// PUBLIC done
exports.getLatestRecipes = asyncHandler(async (req, res) => {
  // Define the number of latest recipes to retrieve
  const limit = 6;

  // Find the latest recipes by sorting them based on 'createdAt' in descending order
  const latest = await Recipe.find().sort({ createdAt: -1 }).limit(limit);

  // Respond with the latest recipes
  res.status(200).json(latest);
});

// GET api/v1/recipe//:RecipeId
// Get detailed information about a recipe including its category, comments, and likes.
// PUBLIC
exports.getRecipeDetails = asyncHandler(async (req, res) => {
  // Get the recipe ID from the request parameters
  const recipeId = req.params.RecipeId;

  // Find the recipe by its ID and populate its related data
  const recipe = await Recipe.findById(recipeId)
    .populate({ path: "category", select: "name" }) // Populate the category field with 'name'
    .populate({ path: "user", select: "name" }) // Populate the user field with 'name'
    .populate({ path: "likes", select: "user like" }) // Populate the likes field with 'user' and 'like'
    .populate({
      path: "comments", // Populate the comments field
      select: "text user likes createdAt likesCount", // Select specific fields from comments
      populate: {
        path: "user", // Populate the user field of comments
        select: "name", // Select the 'name' field of the user
      },
    })
    .sort({ createdAt: -1 }); // Sort the comments by 'createdAt' in descending order

  // Calculate the total number of likes for the recipe
  recipe.likesCount = recipe.likes.length;

  // Calculate the likes count for each comment
  recipe.comments.forEach((comment) => {
    comment.likesCount = comment.likes.length; // Assuming 'likes' is an array of user IDs
  });

  // Respond with the detailed recipe information
  res.status(200).json(recipe);
});

// GET api/vi/recipes/search
// returns recipes with fields matching the exact input text
// PUBLIC
exports.searchRecipe = asyncHandler(async (req, res) => {
  // Extract the search term from the request body
  let searchTerm = req.body.searchTerm;

  // Output the search term to the console for debugging
  console.log(searchTerm);

  // Use MongoDB's text search to find recipes that match the search term
  const recipe = await Recipe.find({
    $text: { $search: searchTerm },
  });

  // Respond with the matching recipes
  res.status(200).json(recipe);
});
// GET api/vi/recipes/random
//  Get a random recipe.
// PUBLIC

exports.getRandomRecipe = asyncHandler(async (req, res) => {
  // Use the MongoDB aggregate framework to select a random recipe (size: 1)
  const recipe = await Recipe.aggregate([{ $sample: { size: 1 } }]);

  // Populate the selected recipe with related data using multiple populate calls
  await Recipe.populate(recipe, [
    { path: "category", select: "name" }, // Populate the category name
    { path: "user", select: "name" }, // Populate the user's name
    { path: "likes", select: "user like" }, // Populate the likes
    {
      path: "comments",
      select: "text user likes createdAt likesCount", // Populate comments with specified fields
      populate: {
        path: "user",
        select: "name", // Populate the user's name in comments
      },
    },
  ]);

  // Respond with the randomly selected and populated recipe
  res.status(200).json(recipe);
});

//  POST api/vi/recipes/add-recipe
//  Create and post a new recipe.
// PRIVATE

exports.postRecipe = asyncHandler(async (req, res, next) => {
  // Extract relevant data from the request body
  const {
    title,
    email,
    instructionsArray: instructions,
    ingredientsArray: ingredients,
    category,
  } = req.body;

  // Process and sanitize the uploaded image, storing it as sanitizedImageName
  const sanitizedImageName = await processImageFile(req, res, next, "recipes");

  // Extract the user ID from the authenticated user's request
  const user = req.user.id;

  // Create a new recipe with the extracted data
  const recipe = await Recipe.create({
    title,
    email,
    instructions,
    ingredients,
    category,
    image: sanitizedImageName,
    user,
  });

  // Respond with a success status and the created recipe
  res.status(201).json({ recipe });
});

// DELETE api/v1/recipe//:RecipeId
// Delete a recipe by its ID.
// PRIVATE
exports.deleteRecipe = asyncHandler(async (req, res, next) => {
  // Extract the recipe ID from the request parameters
  const recipeId = req.params.RecipeId;

  // Extract the recipe's image file name from the associated resource
  const recipeImage = req.resource.image;

  // Delete the image associated with the recipe (assuming the deleteImage function handles this)
  await deleteImage("users", recipeImage);

  // Delete the recipe from the database based on its ID
  await Recipe.deleteOne({ _id: recipeId });

  // Respond with a success message
  return res.status(200).json({ message: "deleted" });
});

// PUT api/v1/recipe//:RecipeId
// Update a recipe by its ID.
// PRIVATE
exports.updateRecipe = asyncHandler(async (req, res, next) => {
  // Find the recipe in the database by its ID
  const recipe = await Recipe.findById(req.params.RecipeId);

  // Initialize the variable for the sanitized image name with the current recipe's image
  let sanitizedImageName = recipe.image;

  // Check if a new image file is provided in the request
  if (req.files.image) {
    // If a new image is provided, update the sanitized image name by processing the new image
    sanitizedImageName = await processImageFile(
      req,
      res,
      next,
      "recipes",
      sanitizedImageName
    );
  }

  // Extract the ID of the recipe to update
  const recipeToUpdate = req.resource.id;

  // Extract the updated recipe data from the request body
  const updatedRecipeData = req.body;

  // If a new image was provided, update the `image` property in the updated data
  if (sanitizedImageName) {
    updatedRecipeData.image = sanitizedImageName;
  }

  // Check if any update data is provided
  if (Object.keys(updatedRecipeData).length === 0) {
    // If no update data is provided, return an error response
    return next(new ErrorResponse("No update data provided", 400));
  }

  // Update the recipe in the database based on its ID with the new data
  const updatedRecipe = await Recipe.findByIdAndUpdate(
    recipeToUpdate,
    updatedRecipeData,
    { new: true, runValidators: true }
  );

  // Respond with a success message and the updated recipe data
  res.status(200).json({ success: true, data: updatedRecipe });
});
