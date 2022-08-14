const express = require('express');
const {
  addToPlaylist,
  changePassword,
  deleteMyProfile,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getMyProfile,
  login,
  logout,
  register,
  removeFromPlaylist,
  resetPassword,
  updateProfile,
  updateprofilepicture,
  updateUserRole,
} = require( "../controllers/userController");
const { authorizeAdmin, isAuthenticated } = require("../middleware/authorizerMiddleware");
const singleUpload = require("../middleware/multerMiddleware");

const router = express.Router();

router.route("/register").post(singleUpload, register);

router.route("/login").post(login);

router.route("/logout").get(logout);


router.route("/me").get(isAuthenticated, getMyProfile);

router.route("/me").delete(isAuthenticated, deleteMyProfile);


router.route("/changepassword").put(isAuthenticated, changePassword);


router.route("/updateprofile").put(isAuthenticated, updateProfile);

router
  .route("/updateprofilepicture")
  .put(isAuthenticated, singleUpload, updateprofilepicture);


router.route("/forgetpassword").post(forgetPassword);

router.route("/resetpassword/:token").put(resetPassword);


router.route("/addtoplaylist").post(isAuthenticated, addToPlaylist);


router.route("/removefromplaylist").delete(isAuthenticated, removeFromPlaylist);

router.route("/admin/users").get(isAuthenticated, authorizeAdmin, getAllUsers);

router
  .route("/admin/user/:id")
  .put(isAuthenticated, authorizeAdmin, updateUserRole)
  .delete(isAuthenticated, authorizeAdmin, deleteUser);

module.exports=router;
