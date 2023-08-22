const asyncHandler = require("../middleware/async");
const Recipe = require("../models/Recipe");
const ErrorResponse = require("../utils/errorResponse");

const sanitizeFilename = require("sanitize-filename");

// GET api/vi/recipes/latest
// LIST OF RECENTLY ADDED RECIPES
// PUBLIC
exports.getLatestRecipes = asyncHandler(async (req, res) => {
  const limit = 6;
  const latest = await Recipe.find().sort({ createdAt: -1 }).limit(limit);
  res.status(200).json(latest);
});
// GET api/vi/recipes/:id
// SINGLE Recipe
// PUBLIC
exports.getRecipeDetails = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const recipe = await Recipe.findById(id);
  res.status(200).json(recipe);
});
// GET api/vi/recipes/:id
// returns recipes with fields matching the exact input text
// PUBLIC
exports.searchRecipe = asyncHandler(async (req, res) => {
  let searchTerm = req.body.searchTerm;
  const recipe = await Recipe.find({
    $text: { $search: searchTerm },
  });
  res.status(200).json(recipe);
});
// GET api/vi/recipes/random
// RETURN A RANDOM RECIPE
// PUBLIC
exports.getRandomRecipe = asyncHandler(async (req, res) => {
  let count = await Recipe.countDocuments();

  // number of recipes to be skipped before recipe to be returned at random
  let random = Math.floor(Math.random() * count);
  const recipe = await Recipe.findOne().skip(random);
  res.status(200).json(recipe);
});
//  POST api/vi/recipes/add-recipe
// ADD A recipe
// PUBLIC
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

  const recipe = await Recipe.create({
    title,
    email,
    instructions,
    ingredients,
    category,
    image: sanitizedImageName,
  });
  res.status(201).json({ recipe });
});
