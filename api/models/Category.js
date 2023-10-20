const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name of Category is required"],
      unique: true,
    },
    image: {
      type: String,
      required: [true, "please upload an image for the category"],
      unique: true,
    },
    user: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
     timestamps: true 
  },
);

// Define a virtual to retrieve recipes related to this category
CategorySchema.virtual("recipes", {
  ref: "Recipe",
  localField: "_id",
  foreignField: "category",
});

CategorySchema.pre("deleteOne", async function (next) {
  const categoryId = this.getQuery()["_id"];
  await mongoose.model("Recipe").deleteMany({ category: categoryId });
});

module.exports = mongoose.model("Category", CategorySchema);
