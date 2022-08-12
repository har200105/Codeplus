const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    
  razorpay_signature: {
    type: String,
    required: true,
  },
    
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  
  razorpay_subscription_id: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
