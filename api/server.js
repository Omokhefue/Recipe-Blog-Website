const express = require("express");
const fileUpload = require("express-fileupload");
require("dotenv").config({ path: "./config/.env" });
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Route files
const recipes = require("./routes/recipes");
const categories = require("./routes/category");
const users = require("./routes/users");
const likes = require("./routes/likes");
const comments = require("./routes/comment");
const auth = require("./routes/auth");
const errorHandler = require("./middleware/error");
const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/v1/recipes", recipes);
app.use("/api/v1/categories", categories);
app.use("/api/v1/users", users);
app.use("/api/v1/likes", likes);
app.use("/api/v1/comments", comments);
app.use("/api/v1/auth", auth);

app.use(errorHandler);

connectDB().then(() =>
  app.listen(
    process.env.PORT || 3000,
    console.log(`server running on port ${process.env.PORT}`)
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log("Unhandled Rejection:", err.message);
  process.exit(1);
});
