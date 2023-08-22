const mongoose = require("mongoose");
const { isEmail } = require("validator");
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
      required: [true, "an email is required"],
    },
    ingredients: {
      type: Array,
      required: [true, "please add at least one ingredient for the recipe"],
    },
    category: {
      type: String,
      enum: {
        values: [
          "Thai",
          "Chinese",
          "Kenyan",
          "Italian",
          "Nigerian",
          "Ghanaian",
        ],
        message: "Please pick a valid category.",
      },
      required: true,
    },
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

module.exports =
  mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema);
