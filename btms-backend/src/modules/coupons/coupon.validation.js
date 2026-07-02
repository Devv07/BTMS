const Joi = require("joi");

// create coupon
const createCouponSchema = Joi.object({
  code: Joi.string()
    .trim()
    .uppercase()
    .min(3)
    .max(20)
    .required(),

  description: Joi.string()
    .allow("")
    .optional(),

  discountType: Joi.string()
    .valid("PERCENTAGE", "FLAT")
    .required(),

  discountValue: Joi.number()
    .positive()
    .required(),

  minimumAmount: Joi.number()
    .min(0)
    .optional(),

  maximumDiscount: Joi.number()
    .min(0)
    .optional(),

  maxUses: Joi.number()
    .integer()
    .min(1)
    .optional(),

  perUserLimit: Joi.number()
    .integer()
    .min(1)
    .default(1),

  startDate: Joi.date()
    .required(),

  expiryDate: Joi.date()
    .greater(Joi.ref("startDate"))
    .required(),
});

// update coupon
const updateCouponSchema = Joi.object({
  code: Joi.string()
    .trim()
    .uppercase()
    .min(3)
    .max(20),

  description: Joi.string()
    .allow(""),

  discountType: Joi.string()
    .valid("PERCENTAGE", "FLAT"),

  discountValue: Joi.number()
    .positive(),

  minimumAmount: Joi.number()
    .min(0),

  maximumDiscount: Joi.number()
    .min(0),

  maxUses: Joi.number()
    .integer()
    .min(1),

  perUserLimit: Joi.number()
    .integer()
    .min(1),

  status: Joi.string()
    .valid("ACTIVE", "INACTIVE", "EXPIRED"),

  startDate: Joi.date(),

  expiryDate: Joi.date(),
});

// apply coupon
const applyCouponSchema = Joi.object({
  code: Joi.string()
    .trim()
    .required(),

  totalAmount: Joi.number()
    .positive()
    .required(),
});

const updateCouponStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "ACTIVE",
      "INACTIVE",
      "EXPIRED"
    )
    .required(),
});

module.exports = {
  createCouponSchema,
  updateCouponSchema,
  applyCouponSchema,
  updateCouponStatusSchema,
};