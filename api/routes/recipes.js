const express = require("express");
const {
  getLatestRecipes,
  searchRecipe,
  getRandomRecipe,
  postRecipe,
  getRecipeDetails,
  deleteRecipe,
  updateRecipe,
} = require("../controllers/recipes");
const router = express.Router();
const { protect} = require("../middleware/auth");
const { checkResourceExists } = require("../middleware/checkResourceExists");
const { checkAuthorization } = require("../middleware/checkAuthorization");

router.get("/latest", getLatestRecipes);
router.get("/random", getRandomRecipe);
router.get("/:RecipeId", checkResourceExists("Recipe"), getRecipeDetails);
router.post("/search", searchRecipe);
router.post("/add-recipe", protect, postRecipe);
router.delete(
  "/:RecipeId",
  protect,
  checkResourceExists("Recipe"),
  checkAuthorization,
  deleteRecipe
);
router.put(
  "/:RecipeId",
  protect,
  checkResourceExists("Recipe"),
  checkAuthorization,
  updateRecipe
);

module.exports = router;
