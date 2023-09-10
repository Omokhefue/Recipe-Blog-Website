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
const { protect, authorize } = require("../middleware/auth");
const { checkResourceExists } = require("../middleware/checkResourceExists");
const { checkAuthorization } = require("../middleware/checkAuthorisation");

router.get("/latest", getLatestRecipes);
router.get("/random", getRandomRecipe);
router.get("/:RecipeId", checkResourceExists("Recipe"), getRecipeDetails);
router.post("/search", checkResourceExists, searchRecipe);
router.post("/add-recipe", protect, authorize("user", "admin"), postRecipe);
router.delete(
  "/:RecipeId",
  protect,
  authorize("user", "admin"),
  checkResourceExists("Recipe"),
  checkAuthorization,
  deleteRecipe
);
router.put(
  "/:RecipeId",
  protect,
  authorize("user", "admin"),
  checkResourceExists("Recipe"),
  checkAuthorization,
  updateRecipe
);

module.exports = router;
