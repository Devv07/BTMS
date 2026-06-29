const Joi = require("joi");

// ======================================================
// CREATE PAYMENT
// ======================================================

const createPayment = Joi.object({
  bookingId: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Booking ID is required",
      "any.required": "Booking ID is required",
    }),

  paymentMethod: Joi.string()
    .trim()
    .valid(
      "CASH",
      "ESEWA",
      "KHALTI",
      "STRIPE",
      "RAZORPAY"
    )
    .required()
    .messages({
      "any.only": "Invalid payment method",
      "any.required": "Payment method is required",
    }),

  customer: Joi.object({
    name: Joi.string().allow("", null),
    email: Joi.string().email().allow("", null),
    phone: Joi.string().allow("", null),
  }).optional(),
});

// ======================================================
// VERIFY PAYMENT
// ======================================================

const verifyPayment = Joi.object({
  paymentId: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Payment ID is required",
      "any.required": "Payment ID is required",
    }),
});

// ======================================================
// REFUND PAYMENT
// ======================================================

const refundPayment = Joi.object({
  paymentId: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Payment ID is required",
      "any.required": "Payment ID is required",
    }),
});

// ======================================================
// WEBHOOK
// ======================================================

const webhook = Joi.object().unknown(true);

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  createPayment,
  verifyPayment,
  refundPayment,
  webhook,
};