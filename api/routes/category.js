const express = require("express");
const {
  getAllCategories,
  getRecipesByCategory,
  getCategoriesForHomepage,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { checkResourceExists } = require("../middleware/checkResourceExists");
const { checkAuthorization } = require("../middleware/checkAuthorization");

router.get("/", getAllCategories);
router.get("/homepage", getCategoriesForHomepage);
router.get(
  "/:CategoryId",
  checkResourceExists("Category"),
  getRecipesByCategory
);
router.post("/", protect, authorize("admin"), addCategory);
router.put(
  "/:CategoryId",
  protect,
  authorize("admin"),
  checkResourceExists("Category"),
  checkAuthorization,
  updateCategory
);
router.delete(
  "/:CategoryId",
  protect,
  authorize("admin"),
  checkResourceExists("Category"),
  checkAuthorization,
  deleteCategory
);

module.exports = router;
