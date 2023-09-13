const mongoose = require("mongoose");
const { isEmail } = require("validator");
const Comment = require("../models/Comment");
const Likes = require("../models/Likes");
const ErrorResponse = require("../utils/errorResponse");

const RecipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please add the title of the recipe"],
    },
    instructions: {
      type: Array,
      required: [true, "fill in at least one instruction for the recipe"],
    },
    email: {
      type: String,
      validate: [isEmail, "please enter a valid email"],
    },
    ingredients: {
      type: Array,
      required: [true, "please add at least one ingredient for the recipe"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Reference to the Category model
      required: true,
    },
    likesCount: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

// when the search fetaure is invoked, it will look for the search value in any of these fields
RecipeSchema.index({
  title: "text",
  instructions: "text",
  ingredients: "text",
  category: "text",
});

RecipeSchema.virtual("comments", {
  ref: "Comment", // Reference to the Comment model
  localField: "_id", // The field in the Recipe model that contains the reference
  foreignField: "recipe", // The field in the Likes model to match against
});
RecipeSchema.virtual("likes", {
  ref: "Likes", // Reference to the Likes model
  localField: "_id", // The field in the Recipe model that contains the reference
  foreignField: "parent", // The field in the Likes model to match against
});

RecipeSchema.pre("deleteOne", async function (next) {
  const recipeId = this.getQuery()["_id"];
  await mongoose.model("Comment").deleteMany({ recipe: recipeId });
  await mongoose.model("Likes").deleteMany({ author: recipeId });
  next();
});
module.exports = mongoose.model("Recipe", RecipeSchema);
