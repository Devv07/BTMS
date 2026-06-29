const asyncHandler = require("express-async-handler");

const paymentService = require("./payment.service");

exports.createPayment = asyncHandler(async (req, res) => {
  const { bookingId, paymentMethod, customer } = req.body;

  const payment = await paymentService.createPayment({
    bookingId,
    paymentMethod,
    customer,
  });

  res.status(201).json({
    success: true,
    message: "Payment created successfully",
    data: payment,
  });
});

// ======================================================
// VERIFY PAYMENT
// ======================================================

exports.verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.body;

  const result = await paymentService.verifyPayment({
    paymentId,
  });

  res.json({
    success: true,
    message: "Payment verified successfully",
    data: result,
  });
});

// ======================================================
// REFUND PAYMENT
// ======================================================

exports.refundPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.body;

  const result = await paymentService.refundPayment({
    paymentId,
  });

  res.json({
    success: true,
    message: "Payment refunded successfully",
    data: result,
  });
});

// ======================================================
// WEBHOOK
// ======================================================

exports.webhook = asyncHandler(async (req, res) => {
  const { method } = req.params;

  const result = await paymentService.handleWebhook(
    method,
    req.body
  );

  res.json({
    success: true,
    message: "Webhook received successfully",
    data: result,
  });
});

// ======================================================
// GET ALL PAYMENTS
// ======================================================

exports.getPayments = asyncHandler(async (req, res) => {
  const payments = await paymentService.getPayments();

  res.json({
    success: true,
    count: payments.length,
    data: payments,
  });
});

// ======================================================
// GET PAYMENT BY ID
// ======================================================

exports.getPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPayment(req.params.id);

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
    });
  }

  res.json({
    success: true,
    data: payment,
  });
});