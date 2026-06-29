const express = require("express");

const router = express.Router();

const paymentController = require("./payment.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

// ======================================================
// CREATE PAYMENT
// POST /api/payments
// ======================================================

router.post(
  "/",
  authMiddleware,
  paymentController.createPayment
);

// ======================================================
// VERIFY PAYMENT
// POST /api/payments/verify
// ======================================================

router.post(
  "/verify",
  authMiddleware,
  paymentController.verifyPayment
);

// ======================================================
// REFUND PAYMENT
// POST /api/payments/refund
// ======================================================

router.post(
  "/refund",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  paymentController.refundPayment
);

// ======================================================
// PAYMENT WEBHOOK
// POST /api/payments/webhook/:method
// ======================================================

router.post(
  "/webhook/:method",
  paymentController.webhook
);

// ======================================================
// GET ALL PAYMENTS
// GET /api/payments
// ======================================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  paymentController.getPayments
);

// ======================================================
// GET PAYMENT BY ID
// GET /api/payments/:id
// ======================================================

router.get(
  "/:id",
  authMiddleware,
  paymentController.getPayment
);

module.exports = router;