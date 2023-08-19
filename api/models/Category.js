const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name of Category is srequired"],
      unique: true,
    },
    image: {
      type: String,
      required: [true, "please upload an image for the category"],
      unique:true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
