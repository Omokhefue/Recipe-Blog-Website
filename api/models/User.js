const { isEmail } = require("validator");
const ErrorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    name: {
      //should not be unique as it is a name not username
      type: [String, 'heyy'],
      required: [true, "please add a username"],
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      // required: [true, "Please add an email"],
      unique: true,
      validate: [isEmail, "Please use a valid URL with HTTP or HTTPS"],
    },
    password: {
      type: String,
      // required: [true, "password is required"],
      minlength: [6, "password should be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    comments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

UserSchema.virtual("recipes", {
  ref: "Recipe",
  localField: "_id",
  foreignField: "user",
});

// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   const salt = bcrypt.genSaltSync(10);
//   this.password = bcrypt.hashSync(this.password, salt);
// });

UserSchema.methods.getSignedJwtToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generate and hash password Token
UserSchema.methods.getResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

UserSchema.statics.login = async function (email, password, next) {
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  const user = await this.findOne({ email }).select("+password");

  if (!user) {
    throw new ErrorResponse("Invalid Credentials", 401);
  }

  const auth = await bcrypt.compare(password, user.password);

  if (auth) {
    return user;
  } else {
    throw new ErrorResponse("Invalid Credentials", 401);
  }
};

UserSchema.pre("deleteOne", { document: true }, async function () {
  await this.model("Recipe").deleteMany({ user: this._id });
});
module.exports = mongoose.model("User", UserSchema);
