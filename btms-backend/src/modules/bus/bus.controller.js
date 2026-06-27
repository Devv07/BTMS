const asyncHandler = require("express-async-handler");
const busService = require("./bus.service");

/**
 * ======================
 * CREATE BUS
 * ======================
 */
exports.createBus = asyncHandler(async (req, res) => {
  console.log(req.body);

  const {
    busName,
    busNumber,
    fromLocation,
    toLocation,
    departureTime,
    arrivalTime,
    totalSeats,
    price,
    type,
    seatConfig,
  } = req.body;

  if (
    !busName ||
    !busNumber ||
    !fromLocation ||
    !toLocation ||
    !departureTime ||
    !arrivalTime ||
    !totalSeats ||
    !price ||
    !type || 
    !seatConfig
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  const bus = await busService.createBus({
    busName,
    busNumber,
    fromLocation,
    toLocation,
    departureTime,
    arrivalTime,
    totalSeats,
    price,
    type,
    seatConfig,
  });

  res.status(201).json({
    success: true,
    message: "Bus created successfully",
    data: bus,
  });
});

/**
 * ======================
 * GET ALL BUSES
 * ======================
 */
exports.getAllBuses = asyncHandler(async (req, res) => {
  const buses = await busService.getAllBuses();

  res.json({
    success: true,
    data: buses,
  });
});

/**
 * ======================
 * GET BUS BY ID
 * ======================
 */
exports.getBusById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const bus = await busService.getBusById(id);

  if (!bus) {
    return res.status(404).json({
      success: false,
      message: "Bus not found",
    });
  }

  res.json({
    success: true,
    data: bus,
  });
});

/**
 * ======================
 * GET BUS SEATS
 * ======================
 */
exports.getBusSeats = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const seats = await busService.getBusSeats(id);

  res.json({
    success: true,
    data: seats,
  });
});