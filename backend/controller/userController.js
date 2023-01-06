const Errorhander = require("../utils/errorHander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

//register a user

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "profilepicurl",
    },
  });
  sendToken(user, 201, res);
});

//login user

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //checking if user has given email and password both
  if (!email || !password) {
    return next(new Errorhander(" Please Enter email and password", 404));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new Errorhander("Invalid email or password", 401));
  }
  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new Errorhander("Invalid email or password", 401));
  }

  //call the function which create token and save it cookies
  sendToken(user, 200, res);
});
