const express = require("express");
const { addFacultyController } = require("../controllers/superAdminController");
const singleUpload = require("../middleware/multerMiddleware");
const router = express.Router();
const {
    isAuthenticated,
    authorizeAdmin
} = require("../middleware/authorizerMiddleware");

router.route("/addFaculty").post(isAuthenticated, authorizeAdmin,singleUpload,addFacultyController);


module.exports = router;