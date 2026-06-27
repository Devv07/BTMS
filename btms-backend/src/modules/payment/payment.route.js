const express = require("express");
const router = express.Router();

const paymentController = require("./payment.controller");

// initiate payment
router.post("/initiate", paymentController.initiatePayment);

// success callback/webhook
router.post("/success", paymentController.paymentSuccess);

// failed payment
router.post("/failed", paymentController.paymentFailed);

module.exports = router;