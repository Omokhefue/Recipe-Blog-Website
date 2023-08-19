const express = require("express");
const {
  getLatestRecipes,
  searchRecipe,
  getRandomRecipe,
  postRecipe,
  getRecipeDetails,
} = require("../controllers/recipes");
const router = express.Router();

router.get("/latest", getLatestRecipes);
router.get("/random", getRandomRecipe);
router.get("/:id", getRecipeDetails);
router.post("/search", searchRecipe);
router.post("/add-recipe", postRecipe);

module.exports = router;
