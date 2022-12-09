const ErrorHandler = require("../errorHandlers/errorHandler");
const {catchAsyncErrors} = require("../errorHandlers/catchAsyncErrors");
const User = require("../models/User");
const crypto = require("crypto");
const Course = require("../models/Course");
const cloudinary = require("cloudinary");
const getDataUri = require("../middleware/dataURI");
const Stats = require("../models/Stats");
const {sendEmail} = require("../middleware/mailMiddleware");

const sendToken = (res, user, message, statusCode = 200) => {
  try {
    
    const token = user.getJWTToken();

    const options = {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    return res.status(statusCode).cookie("token", token, options).json({
      success: true,
      message,
      user,
      token
    });
  } catch (err) {
    console.log(err);
  }
};

exports.register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password,isFaculty,department} = req.body;
  let file = req.file;

  if (!name || !email || !password) {
     return next(new ErrorHandler(`Please enter all fields`, 400));
  }

  let user = await User.findOne({ email });

  if (user) {
     return next(new ErrorHandler(`User Already Exist`, 409));
  }

  let fileUri;

  if (file) {
     fileUri = getDataUri(file);
  }
  let mycloud;
  if (fileUri) {
     mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
  }

  const emailToken = crypto.randomBytes(20).toString("hex");
  const emailVerificationUrl = `${process.env.FRONTEND_URL}/verify/email/${emailToken}`;
  const message = `Please Verify your email by clicking at this link :- \n\n ${emailVerificationUrl} \n\n.`;
  await sendEmail(email, "Codeplus Email Verification", message);

  user = await User.create({
    name,
    email:email.toLowerCase(),
    password,
    emailVerificationToken: emailToken, 
    wantedTobeFaculty: isFaculty,
    department,
    avatar: {
      public_id: mycloud?.public_id,
      url: mycloud?.secure_url,
    },
  });

  return res.status(201).json({
      success: true,
      message:"Please verify your email by checking your mail box."
  });
});


exports.verifyEmail = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ emailVerificationToken: req.body.token });
  if (user) {
    user.verified = true;
    user.emailVerificationToken = undefined;
    await user.save({ validateBeforeSave: true });
    res.status(200).json({ success: true,message:"Email Verified Sucessfully" });
  } else {
     return next(new ErrorHandler("Not a valid Email Verification url", 404));
  }
});


exports.login = catchAsyncErrors(async (req, res, next) => {
  
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter all field", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Incorrect Email or Password", 401));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
      return next(new ErrorHandler("Incorrect Email or Password", 401));
  }

  if (!user.verified) {
    return next(new ErrorHandler("Email not verified yet", 401));
  }

  sendToken(res, user, `Welcome back, ${user.name}`, 200);

});

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
});

exports.getMyProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

exports.changePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return next(new ErrorHandler("Please enter all field", 400));

  const user = await User.findById(req.user._id).select("+password");

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) return next(new ErrorHandler("Incorrect Old Password", 400));

  user.password = newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Changed Successfully",
  });
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
  });
});

exports.updateprofilepicture = catchAsyncErrors(async (req, res, next) => {
  const file = req.file;

  const user = await User.findById(req.user._id);
  console.log(user);

  const fileUri = getDataUri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
  if (user?.avatar && user?.avatar?.public_id) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  }

  user.avatar = {
    public_id: mycloud.public_id,
    url: mycloud.secure_url,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile Picture Updated Successfully",
  });
});

exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler("User not found", 400));

  const resetToken = await user.getResetToken();

  await user.save();

  const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  const message = `Click on the link to reset your password. ${url}. If you have not request then please ignore.`;

  await sendEmail(user.email, "Codeplus Reset Password", message);

  res.status(200).json({
    success: true,
    message: `Reset Token has been sent to ${user.email}`,
  });
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new ErrorHandler("Token is invalid or has been expired", 401));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Changed Successfully",
  });
});

exports.addToPlaylist = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const course = await Course.findById(req.body.id);

  if (!course) return next(new ErrorHandler("Invalid Course Id", 404));

  const itemExist = user.playlist.find((item) => {
    if (item.course.toString() === course._id.toString()) return true;
  });

  if (itemExist) return next(new ErrorHandler("Item Already Exist", 409));

  user.playlist.push({
    course: course._id,
    poster: course.poster.url,
  });

  await user.save();

  res.status(200).json({
    success: true,
    message: "Added to playlist",
  });
});

exports.removeFromPlaylist = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const course = await Course.findById(req.query.id);
  if (!course) return next(new ErrorHandler("Invalid Course Id", 404));

  const newPlaylist = user.playlist.filter((item) => {
    if (item.course.toString() !== course._id.toString()) return item;
  });

  user.playlist = newPlaylist;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Removed From Playlist",
  });
});


exports.getAllFaculties = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({$and:[{wantedTobeFaculty:true},{verified:true}]});
  res.status(200).json({
    success: true,
    users,
  });
});

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
     return next(new ErrorHandler("User not found", 404));
  }

  if (user.role === "user") {
     user.role = "faculty";
  }

  else if (user.role === "faculty") {
    user.role = "user";
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Role Updated",
  });
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (user?.avatar && user?.avatar?.public_id) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

exports.deleteMyProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user?.avatar && user?.avatar?.public_id) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  }

  await user.remove();

  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "User Deleted Successfully",
    });
});

User.watch().on("change", async () => {
  const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);

  const subscription = await User.find({ "subscription.status": "active" });
  stats[0].users = await User.countDocuments();
  stats[0].subscription = subscription.length;
  stats[0].createdAt = new Date(Date.now());

  await stats[0].save();
});
