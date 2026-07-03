const Joi = require('joi');

const createRefundSchema = Joi.object({
    bookingId: Joi.string().required(),

    reason: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .required(),
});

const updateRefundStatusSchema = Joi.object({
  status: Joi.string()
    .valid("APPROVED", "REJECTED")
    .required(),

  adminRemark: Joi.string()
    .trim()
    .max(500)
    .allow("")
    .optional(),
});

module.exports = {
    createRefundSchema,
    updateRefundStatusSchema,
};