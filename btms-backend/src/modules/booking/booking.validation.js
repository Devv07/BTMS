const { z } = require("zod");

const createBookingSchema = z.object({
  busId: z.string({
    required_error: "Bus ID is required",
  }),

  seats: z.coerce
    .number({
      required_error: "Seats are required",
      invalid_type_error: "Seats must be a number",
    })
    .int("Seats must be integer")
    .positive("Seats must be greater than 0"),
});

module.exports = {
  createBookingSchema,
};