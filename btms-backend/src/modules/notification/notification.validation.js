const Joi = require("joi");

// ========================================
// EMAIL
// ========================================

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
  fullName: Joi.string().required(),
});

// ========================================
// SMS
// ========================================

const smsSchema = Joi.object({
  phone: Joi.string().required(),
  message: Joi.string().required(),
});

// ========================================
// PUSH
// ========================================

const pushSchema = Joi.object({
  deviceToken: Joi.string().required(),
  title: Joi.string().required(),
  body: Joi.string().required(),
  data: Joi.object().optional(),
});

module.exports = {
  emailSchema,
  smsSchema,
  pushSchema,
};