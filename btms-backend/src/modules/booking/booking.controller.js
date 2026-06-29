const asyncHandler = require("express-async-handler");
const bookingService = require("./booking.service");

// -------------------------
// CREATE BOOKING
// -------------------------
exports.createBooking = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: user not found",
    });
  }

  const userId = req.user.id;

  const { busId, seatNumbers } = req.body;

  if (!busId || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
    return res.status(400).json({
      success: false,
      message: "busId and seatNumbers are required",
    });
  }

  const booking = await bookingService.createBooking({
    userId,
    busId,
    seatNumbers,
  });

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

// -------------------------
// GET ALL BOOKINGS (pagination/search/sort)
// -------------------------
exports.getAllBookings = asyncHandler(async (req, res) => {
  const result = await bookingService.getAllBookings(req.query);

  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

// -------------------------
// GET BOOKING BY ID
// -------------------------
exports.getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Booking id is required",
    });
  }

  const booking = await bookingService.getBookingById(id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  res.json({
    success: true,
    data: booking,
  });
});

// -------------------------
// GET BOOKINGS BY BUS ID
// -------------------------
exports.getBookingsByBusId = asyncHandler(async (req, res) => {
  const { busId } = req.params;

  if (!busId) {
    return res.status(400).json({
      success: false,
      message: "busId is required",
    });
  }

  const bookings = await bookingService.getBookingsByBusId(busId);

  res.json({
    success: true,
    data: bookings,
  });
});

// Get BOOKINGS FOR THE LOGGED-IN USER
exports.getMyBookings = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const bookings = await bookingService.getMyBookings(userId);

  res.json({
    success: true,
    data: bookings,
  });
});

// Delete a booking
exports.deleteBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.deleteBooking(
    req.params.id,
    req.user.id,
    req.user.role
  );
  res.json({
    success: true,
    message: "Booking deleted successfully",
    data: booking,
  });
});

// download ticket PDF
exports.downloadTicket = asyncHandler(async (req, res) => {
  const pdfBuffer = await bookingService.generateTicketPDF(req.params.id);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=ticket-${req.params.id}.pdf`
  );

  res.send(pdfBuffer);
});


// BOOKING CONFIRMED
exports.confirmBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.confirmBooking(
    req.params.id
  );
  res.json({
    success: true,
    message: "Booking confirmed successfully",
    data: booking,
  });
});