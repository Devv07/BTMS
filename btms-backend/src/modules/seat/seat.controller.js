const asyncHandler = require("express-async-handler");
const seatService = require("./seat.service");

// HOLD SEATS API
exports.holdSeats = asyncHandler(async (req, res) => {
  const { busId, seatNumbers } = req.body;

  const result = await seatService.holdSeats({
    busId,
    seatNumbers,
  });

  res.status(200).json({
    success: true,
    message: result.message,
    totalSeats: seatNumbers.length,
    expiresAt: result.expiresAt,
  });
});

exports.generateSeats = async (req, res) => {
  res.json({ 
    success: true,
    message: "Seats generated successfully",
    totalSeats: req.body.totalSeats,
    seatLayout: req.body.seatLayout || [],
 });
};
