const { isEmail } = require("validator");
const ErrorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");

const Comment = require("../models/Comment");
const Likes = require("../models/Likes");
const Recipe = require("../models/Recipe");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/sendEmail");

const UserSchema = new mongoose.Schema(
  {
    name: {
      //should not be unique as it is a name not username
      type: String,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      validate: [isEmail, "Please use a valid URL with HTTP or HTTPS"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
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
    verifyEmailOTP: String,
    verifyEmailOTPExpire: Date,
    verifiedStatus: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
     timestamps: true 
  },
);

UserSchema.virtual("recipes", {
  ref: "Recipe",
  localField: "_id",
  foreignField: "user",
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

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
UserSchema.methods.getVerifyEmailOTP = async function (email, res) {
  if (this.verifiedStatus) {
    throw new ErrorResponse(`user ${this._id} is already verified`);
  }
  const otp = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
  });

  this.verifyEmailOTP = otp;
  this.verifyEmailOTPExpire = Date.now() + 1 * 60 * 1000;

  await this.save({ validateBeforeSave: false });

  const message = `An OTP has been sent to you . \n please input the OTP you recieved into the box below. \n ${otp} `;

  try {
    await sendEmail({
      email,
      subject: "OTP from OmoFoodsAndCo",
      message,
    });
  } catch (err) {
    this.verifyEmailOTP = undefined;
    this.verifyEmailOTPExpireExpire = undefined;
    throw new ErrorResponse("Email could not be sent");
  }
};

UserSchema.methods.verifyEmail = async function (user, userEnteredOTP, res) {
  const currentTime = Date.now();
  const elapsedTime = currentTime - user.verifyEmailOTPExpire;

  if (
    elapsedTime <= user.verifyEmailOTPExpire &&
    user.verifyEmailOTP === userEnteredOTP
  ) {
    // OTP is valid and within the timeout window
    user.verifyEmailOTP = undefined;
    user.verifyEmailOTPExpire = undefined;
    user.verifiedStatus = true;
    await user.save(); // Save changes to the user
    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } else {
    // OTP is either expired or incorrect
    throw new ErrorResponse("Invalid Token", 400);
  }
};

UserSchema.statics.login = async function (email, password, next) {
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  const user = await this.findOne({ email }).select("+password");

  if (!user) {
    throw new ErrorResponse("Invalid Credentials", 401);
  }

  const auth = bcrypt.compare(password, user.password);

  if (auth) {
    return user;
  } else {
    throw new ErrorResponse("Invalid Credentials", 401);
  }
};

UserSchema.pre("deleteOne", async function (next) {
  const userId = this.getQuery()["_id"];

  await mongoose.model("Recipe").deleteMany({ user: userId });
  await mongoose.model("Comment").deleteMany({ author: userId });
  await mongoose.model("Likes").deleteMany({ author: userId });

  next();
});

module.exports = mongoose.model("User", UserSchema);
