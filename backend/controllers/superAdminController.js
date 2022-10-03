const User = require("../models/User");
const ErrorHandler = require("../errorHandlers/errorHandler");
const { catchAsyncErrors } = require("../errorHandlers/catchAsyncErrors");
const getDataUri = require("../middleware/dataURI");
const cloudinary = require("cloudinary");


exports.addFacultyController = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
      const file = req.file;

    if (!name || !email || !password || !file){
       return next(new ErrorHandler("Please enter all fields", 400));
    }
    
    let user = await User.findOne({ email });

    if (user) {
         return next(new ErrorHandler("User Already Exist", 409));
    }

    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);


   user = await User.create({
    name,
    email,
    password,
    role:"faculty",
    avatar: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: `Faculty Added , Now They Can Add Courses.`,
  });
});