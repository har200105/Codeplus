const express = require('express');
const {
  buySubscription,
  cancelSubscription,
  getRazorPayKey,
  paymentVerification,
} = require("../controllers/paymentController");
const { isAuthenticated } = require("../middleware/authorizerMiddleware");

const router = express.Router();

// Buy Subscription
router.route("/subscribe").get(isAuthenticated, buySubscription);

// Verify Payment and save reference in database
router.route("/paymentverification").post(paymentVerification);

// Get Razorpay key
router.route("/razorpaykey").get(getRazorPayKey);

// Cancel Subscription
router.route("/subscribe/cancel").delete(isAuthenticated, cancelSubscription);

module.exports=router;