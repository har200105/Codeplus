const express = require('express');
const {
  addLecture,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllCourses,
  getCourseLectures,
  getAdminCourses,
} = require("../controllers/courseController");
const {
  authorizeAdmin,
  isAuthenticated,
  authorizeSubscribers,
} = require("../middleware/authorizerMiddleware");
const singleUpload = require("../middleware/multerMiddleware");

const router = express.Router();

router.route("/courses").get(getAllCourses);
router.route("/getAdminCourses").get(isAuthenticated,authorizeAdmin,getAdminCourses);

router
  .route("/createcourse")
  .post(isAuthenticated, authorizeAdmin, singleUpload, createCourse);

router
  .route("/course/:id")
  .get(isAuthenticated, authorizeSubscribers, getCourseLectures)
  .post(isAuthenticated, authorizeAdmin, singleUpload, addLecture)
  .delete(isAuthenticated, authorizeAdmin, deleteCourse);

router.route("/lecture").delete(isAuthenticated, authorizeAdmin, deleteLecture);

module.exports=router;
