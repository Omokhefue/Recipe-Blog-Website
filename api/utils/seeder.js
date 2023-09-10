const fs = require("fs");
const Category = require("../models/Category");
const Comment = require("../models/Comment");
const Recipe = require("../models/Recipe");
const Likes = require("../models/Likes");
const User = require("../models/User");
const mongoose = require("mongoose");

require("dotenv").config({ path: "../config/.env" });

mongoose.connect(process.env.MONGO_URI);

// reading the file content
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/category.json`, "utf-8")
);

const recipes = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/recipe.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/user.json`, "utf-8")
);
const likes = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/likes.json`, "utf-8")
);
const comments = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/comment.json`, "utf-8")
);

// add files ot database
const importData = async () => {
  try {
    await Category.create(categories);
    await Comment.create(comments);
    await Recipe.create(recipes);
    await User.create(users);
    await Likes.create(likes);
    console.log("data imported");
    process.exit(1);
  } catch (error) {
    console.log(`${error}, occured while importing data`);
  }
};

// deleting files from databse
const deleteData = async () => {
  try {
    await Category.deleteMany();
    await Comment.deleteMany();
    await Recipe.deleteMany();
    await User.deleteMany();
    await Likes.deleteMany();
    console.log("data deleted");
    process.exit(1);
  } catch (error) {
    console.log(`${error}, occured while deleting data`);
  }
};

if (process.argv[2] === "-i") {
  importData();
}
if (process.argv[2] === "-d") {
  deleteData();
}
