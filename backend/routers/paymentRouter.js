const express = require('express');
const {
  buySubscription,
  cancelSubscription,
  getRazorPayKey,
  paymentVerification,
} = require("../controllers/paymentController");
const { isAuthenticated } = require("../middleware/authorizerMiddleware");

const router = express.Router();

router.route("/subscribe").get(isAuthenticated, buySubscription);

router.route("/paymentverification").post(paymentVerification);

router.route("/razorpaykey").get(getRazorPayKey);

router.route("/subscribe/cancel").delete(isAuthenticated, cancelSubscription);

module.exports=router;