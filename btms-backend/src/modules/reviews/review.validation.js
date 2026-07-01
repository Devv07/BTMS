const Joi = require("joi");

// create review
const createReview = {
  body: Joi.object({
    bookingId: Joi.string().required(),

    rating: Joi.number()
      .integer()
      .min(1)
      .max(5)
      .required(),

    comment: Joi.string()
      .max(1000)
      .allow("")
      .optional(),
  }),
};

// update review
const updateReview = {
  body: Joi.object({
    rating: Joi.number()
      .integer()
      .min(1)
      .max(5)
      .optional(),

    comment: Joi.string()
      .max(1000)
      .allow("")
      .optional(),
  }).min(1),
};

// review query
const reviewQuery = {
  query: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10),

    rating: Joi.number()
      .integer()
      .min(1)
      .max(5)
      .optional(),

    busId: Joi.string().optional(),

    userId: Joi.string().optional(),
  }),
};

module.exports = {
  createReview,
  updateReview,
  reviewQuery,
};