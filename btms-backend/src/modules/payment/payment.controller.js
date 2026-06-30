const asyncHandler = require("express-async-handler");
const paymentService = require("./payment.service");

// ========================================
// CREATE PAYMENT
// ========================================

exports.createPayment = asyncHandler(async (req, res) => {
  const result = await paymentService.createPayment(req.body);

  res.status(201).json(result);
});

// ========================================
// VERIFY PAYMENT
// ========================================

exports.verifyPayment = asyncHandler(async (req, res) => {
  const result = await paymentService.verifyPayment(req.body);

  res.json(result);
});

// ========================================
// REFUND PAYMENT
// ========================================

exports.refundPayment = asyncHandler(async (req, res) => {
  const result = await paymentService.refundPayment(req.body);

  res.json(result);
});

// ========================================
// GET ALL PAYMENTS
// ========================================

exports.getPayments = asyncHandler(async (req, res) => {
  const payments = await paymentService.getPayments();

  res.json({
    success: true,
    data: payments,
  });
});

// ========================================
// GET PAYMENT
// ========================================

exports.getPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPayment(req.params.id);

  res.json({
    success: true,
    data: payment,
  });
});

// ========================================
// ESEWA SUCCESS CALLBACK
// ========================================

exports.esewaSuccess = asyncHandler(async (req, res) => {
  const { oid } = req.query;

  if (!oid) {
    return res.status(400).json({
      success: false,
      message: "Transaction id missing",
    });
  }

  const result = await paymentService.verifyPayment({
    paymentId: oid,
  });

  res.json(result);
});

// ========================================
// ESEWA FAILURE CALLBACK
// ========================================

exports.esewaFailure = asyncHandler(async (req, res) => {
  res.status(400).json({
    success: false,
    message: "Payment cancelled or failed.",
  });
});