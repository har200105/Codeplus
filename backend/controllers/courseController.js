const Course = require("../models/Course");
const Stats = require("../models/Stats");
const ErrorHandler = require("../errorHandlers/errorHandler");
const { catchAsyncErrors } = require("../errorHandlers/catchAsyncErrors");
const getDataUri = require("../middleware/dataURI");
const cloudinary = require("cloudinary");

exports.getAllCourses = catchAsyncErrors(async (req, res, next) => {
  const keyword = req.query.keyword || "";
  const category = req.query.category || "";

  const courses = await Course.find({
    title: {
      $regex: keyword,
      $options: "i",
    },
    category: {
      $regex: category,
      $options: "i",
    },
  })
    .populate("createdBy","name")
    .select("-lectures");
  res.status(200).json({
    success: true,
    courses,
  });
});


exports.getAdminCourses = catchAsyncErrors(async (req, res, next) => {

  const courses = await Course.find({
    createdBy: req.user._id
  })
    .populate("createdBy","name")
    .select("-lectures");
  res.status(200).json({
    success: true,
    courses,
  });
});


exports.createCourse = catchAsyncErrors(async (req, res, next) => {
  console.log("req");
  console.log(req.user);
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    return next(new ErrorHandler("Please add all fields", 400));
  }

  const file = req.file;

  const fileUri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  await Course.create({
    title,
    description,
    category,
    createdBy:req.user._id,
    poster: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Course Created Successfully. You can add lectures now.",
  });
});

exports.getCourseLectures = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) return next(new ErrorHandler("Course not found", 404));

  course.views += 1;

  await course.save();

  res.status(200).json({
    success: true,
    lectures: course.lectures,
  });
});

exports.addLecture = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const course = await Course.findById(id);

  if (!course) {
     return next(new ErrorHandler("Course not found", 404));
  }

  const file = req.file;
  const fileUri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content, {
    resource_type: "video",
  });

  course.lectures.push({
    title,
    description,
    video: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });

  course.numOfVideos = course.lectures.length;

  await course.save();

  res.status(200).json({
    success: true,
    message: "Lecture added in Course",
  });
});

exports.deleteCourse = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) return next(new ErrorHandler("Course not found", 404));

  await cloudinary.v2.uploader.destroy(course.poster.public_id);

  for (let i = 0; i < course.lectures.length; i++) {
    const singleLecture = course.lectures[i];
    await cloudinary.v2.uploader.destroy(singleLecture.video.public_id, {
      resource_type: "video",
    });
  }

  await course.remove();

  res.status(200).json({
    success: true,
    message: "Course Deleted Successfully",
  });
});

exports.deleteLecture = catchAsyncErrors(async (req, res, next) => {
  const { courseId, lectureId } = req.query;

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  const lecture = course.lectures.find((item) => {
    if (item._id.toString() === lectureId.toString()) return item;
  });
  await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
    resource_type: "video",
  });

  course.lectures = course.lectures.filter((item) => {
    if (item._id.toString() !== lectureId.toString()) return item;
  });

  course.numOfVideos = course.lectures.length;

  await course.save();

  res.status(200).json({
    success: true,
    message: "Lecture Deleted Successfully",
  });
});

Course.watch().on("change", async () => {
  const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);

  const courses = await Course.find({});

  let totalViews = 0;

  for (let i = 0; i < courses.length; i++) {
    totalViews += courses[i].views;
  }
  stats[0].views = totalViews;
  stats[0].createdAt = new Date(Date.now());

  await stats[0].save();
});