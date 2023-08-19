const fs = require("fs");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
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

// add files ot database
const importData = async () => {
  try {
    await Category.create(categories);
    await Recipe.create(recipes);
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
    await Recipe.deleteMany();
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
