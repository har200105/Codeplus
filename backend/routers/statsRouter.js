const express = require("express");
const {
  contact,
  courseRequest,
  getDashboardStats,
} = require("../controllers/statsController");

const { authorizeAdmin, isAuthenticated } = require("../middleware/authorizerMiddleware");

const router = express.Router();

router.route("/courserequest").post(courseRequest);

router
  .route("/admin/stats")
  .get(isAuthenticated, authorizeAdmin, getDashboardStats);

module.exports = router;
