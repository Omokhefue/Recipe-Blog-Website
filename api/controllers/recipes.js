const asyncHandler = require("../middleware/async");
const Category = require("../models/Category");
const User = require("../models/User");
const Likes = require("../models/Likes");
const Recipe = require("../models/Recipe");
const Comment = require("../models/Comment");
const ErrorResponse = require("../utils/errorResponse");

const sanitizeFilename = require("sanitize-filename");

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
    .populate({ path: "likes", select: "author like" })
    .populate({
      path: "comments",
      select: "text author likes createdAt likesCount",
      populate: {
        path: "author",
        select: "name", // Select the fields you want from the author object
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
// PUBLIC
exports.searchRecipe = asyncHandler(async (req, res) => {
  console.log(1)
  let searchTerm = req.body.searchTerm;
  console.log(searchTerm)
  const recipe = await Recipe.find({
    $text: { $search: searchTerm },
  });
  res.status(200).json(recipe);
});
// GET api/vi/recipes/random
// RETURN A RANDOM RECIPE
// PUBLIC done
exports.getRandomRecipe = asyncHandler(async (req, res) => {
  let count = await Recipe.countDocuments();

  // number of recipes to be skipped before recipe to be returned at random
  let random = Math.floor(Math.random() * count);
  const recipe = await Recipe.findOne()
    .skip(random)
    .populate({ path: "category", select: "name" })
    .populate({ path: "user", select: "name " })
    .populate({ path: "likes", select: "author like" })
    .populate({
      path: "comments",
      select: "text author likes createdAt likesCount",
      populate: {
        path: "author",
        select: "name", // Select the fields you want from the author object
      },
    });
  recipe.likesCount = recipe.likes.length;
  recipe.comments.forEach((comment) => {
    comment.likesCount = comment.likes.length; // Assuming likes is an array of user IDs
  });
  res.status(200).json(recipe);
});
//  POST api/vi/recipes/add-recipe
// ADD A recipe
// PUBLIC done
exports.postRecipe = asyncHandler(async (req, res, next) => {
  let sanitizedImageName;
  const {
    title,
    email,
    instructionsArray: instructions,
    ingredientsArray: ingredients,
    category,
  } = req.body;

  if (!req.files || Object.keys(req.files).length === 0) {
    throw new ErrorResponse("no image uploaded", 400);
  }
  let imageFile = req.files.image;

  const fileExtension = imageFile.name.split(".").pop(); // getting the image extension
  const allowedExtensions = ["jpg", "jpeg", "png", "gif"]; // types of allowed image types

  // checking if uploaded image file was of the correct format
  if (!allowedExtensions.includes(fileExtension)) {
    next(
      new ErrorResponse(
        "Invalid file type. Please upload a valid image file (.jpg, .jpeg, .png, .gif).",
        422
      )
    );
  } else {
    // generate a unique file name by adding the date beforehand
    sanitizedImageName = `${Date.now()}_${sanitizeFilename(imageFile.name)}`;
  }

  let uploadPath = `${__dirname}/../public/images/recipes/${sanitizedImageName}`;

  // move image file to to the public/images folder
  await imageFile.mv(uploadPath);

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

  await Recipe.deleteOne({ _id: recipeId });
  return res.status(200).json({ message: "deleted" });
});

// done
exports.updateRecipe = asyncHandler(async (req, res, next) => {
  const recipeToUpdate = req.resource.id;

  const updatedRecipeData = req.body;

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
