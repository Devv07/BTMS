const express = require("express");
const router = express.Router();

const bookingController = require("./booking.controller");

const auth = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/role.middleware");

// CREATE BOOKING
router.post(
  "/",
  auth,
  authorize("USER", "ADMIN", "SUPER_ADMIN"),
  bookingController.createBooking
);

// GET ALL BOOKINGS
router.get(
  "/",
  auth,
  authorize("ADMIN", "SUPER_ADMIN"),
  bookingController.getAllBookings
);

// GET BOOKING BY ID
router.get(
  "/:id",
  auth,
  authorize("ADMIN", "SUPER_ADMIN"),
  bookingController.getBookingById
);

// GET BOOKINGS BY BUS ID
router.get(
  "/bus/:busId",
  auth,
  authorize("ADMIN", "SUPER_ADMIN"),
  bookingController.getBookingsByBusId
);

// User -own bookings
router.get(
  "/my-bookings",
  auth,
  bookingController.getMyBookings
);

// DELETE BOOKING
router.delete(
  "/:id",
  auth,
  bookingController.deleteBooking
);

// GENERATE TICKET PDF
router.get(
  "/:id/ticket",
  auth,
  bookingController.downloadTicket
);

module.exports = router;