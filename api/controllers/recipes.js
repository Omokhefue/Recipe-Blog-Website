const asyncHandler = require("../middleware/async");
const Category = require("../models/Category");
const User = require("../models/User");
const Likes = require("../models/Likes");
const Recipe = require("../models/Recipe");
const Comment = require("../models/Comment");
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
exports.getRecipeDetails = asyncHandler(async (req, res) => {
  // Define a route to get a recipe with its category, comments, and likes
  const recipeId = req.params.RecipeId;
  const recipe = await Recipe.findById(recipeId)
    .populate({ path: "category", select: "name" })
    .populate({ path: "user", select: "name " })
    .populate({ path: "likes", select: "user like" })
    .populate({
      path: "comments",
      select: "text user likes createdAt likesCount",
      populate: {
        path: "user",
        select: "name", // Select the fields you want from the user object
      },
    })
    .sort({ createdAt: -1 });
  recipe.likesCount = recipe.likes.length;
  recipe.comments.forEach((comment) => {
    comment.likesCount = comment.likes.length; // Assuming likes is an array of user IDs
  });
  res.status(200).json(recipe);
});
// GET api/vi/recipes/:id
// returns recipes with fields matching the exact input text
// PUBLIC done
exports.searchRecipe = asyncHandler(async (req, res) => {
  let searchTerm = req.body.searchTerm;
  console.log(searchTerm);
  const recipe = await Recipe.find({
    $text: { $search: searchTerm },
  });
  res.status(200).json(recipe);
});
// GET api/vi/recipes/random
// RETURN A RANDOM RECIPE
// PUBLIC done
exports.getRandomRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.aggregate([
    { $sample: { size: 1 } }, // Randomly select 1 category
  ]);
  await Recipe.populate(recipe, [
    { path: "category", select: "name" },
    { path: "category", select: "name" },
    { path: "user", select: "name" },
    { path: "likes", select: "user like" },
    {
      path: "comments",
      select: "text user likes createdAt likesCount",
      populate: {
        path: "user",
        select: "name",
      },
    },
  ]);
  res.status(200).json(recipe);
});
//  POST api/vi/recipes/add-recipe
// ADD A recipe
// PUBLIC done
exports.postRecipe = asyncHandler(async (req, res, next) => {
  const {
    title,
    email,
    instructionsArray: instructions,
    ingredientsArray: ingredients,
    category,
  } = req.body;

  const sanitizedImageName = await processImageFile(req, res, next, "recipes");

  const user = req.user.id;

  const recipe = await Recipe.create({
    title,
    email,
    instructions,
    ingredients,
    category,
    image: sanitizedImageName,
    user,
  });
  res.status(201).json({ recipe });
});

// done
exports.deleteRecipe = asyncHandler(async (req, res, next) => {
  const recipeId = req.params.RecipeId;
  const recipeImage = req.resource.image;

  await deleteImage("users", recipeImage);
  await Recipe.deleteOne({ _id: recipeId });
  return res.status(200).json({ message: "deleted" });
});

// done but still has consideratios
exports.updateRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.RecipeId);

  let sanitizedImageName = recipe.image;
  if (req.files.image) {
    sanitizedImageName = await processImageFile(
      req,
      res,
      next,
      "recipes",
      sanitizedImageName
    );
  }
  const recipeToUpdate = req.resource.id;

  const updatedRecipeData = req.body;
  if (sanitizedImageName) {
    updatedRecipeData.image = sanitizedImageName;
  }
  if (Object.keys(updatedRecipeData).length === 0) {
    return next(new ErrorResponse("No update data provided", 400));
  }

  const updatedRecipe = await Recipe.findByIdAndUpdate(
    recipeToUpdate,
    updatedRecipeData,
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, data: updatedRecipe });
});
