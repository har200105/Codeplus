const User = require("../models/User");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../errorHandlers/errorHandler");
const { catchAsyncErrors } = require("../errorHandlers/catchAsyncErrors");


exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const  token  = req.headers.authorization;
  console.log(token);

    if (!token) {
        return next(new ErrorHandler("Not Logged In", 401));
    }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  console.log(decoded);

  req.user = await User.findById(decoded._id);

  next();
});


exports.authorizeSubscribers = (req, res, next) => {
    if (req.user.subscription.status !== "active" && req.user.role !== "admin") {
        return next(
            new ErrorHandler(`Only Subscribers can acces this resource`, 403)
        );
    }

  next();
};

exports.authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return next(
            new ErrorHandler(
                `${req.user.role} is not allowed to access this resource`,
                403
            )
        );
    }

  next();
};
