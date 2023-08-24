const mongoose = require("mongoose");
const { isEmail } = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add a username"],
      unique: true,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      validate: [isEmail, "please enter a valid"],
    },
    recipes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      type: [String],
    },
    comments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
