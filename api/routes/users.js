const express = require("express");
const { getAllUsers } = require("../controllers/users");
const router = express.Router();

router.get("/", getAllUsers);
// router.get("/categories", getAllCategories);
// router.get("/:category", getRecipesByCategory);

module.exports = router;
