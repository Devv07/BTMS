const Joi = require("joi");

// dashboard report
const dashboard = {
  query: Joi.object({
    startDate: Joi.date().optional(),

    endDate: Joi.date().optional(),
  }),
};

// revenue report
const revenue = {
  query: Joi.object({
    startDate: Joi.date().optional(),

    endDate: Joi.date().optional(),

    groupBy: Joi.string()
      .valid("day", "week", "month", "year")
      .optional(),
  }),
};

// booking report
const bookings = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),

    limit: Joi.number().integer().min(1).default(10),

    status: Joi.string()
      .valid("PENDING", "CONFIRMED", "CANCELLED")
      .optional(),

    busId: Joi.string().optional(),

    userId: Joi.string().optional(),

    startDate: Joi.date().optional(),

    endDate: Joi.date().optional(),
  }),
};

// payment report
const payments = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),

    limit: Joi.number().integer().min(1).default(10),

    method: Joi.string().optional(),

    status: Joi.string().optional(),

    startDate: Joi.date().optional(),

    endDate: Joi.date().optional(),
  }),
};

module.exports = {
  dashboard,
  revenue,
  bookings,
  payments,
};