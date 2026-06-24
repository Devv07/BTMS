const asyncHandler = require("express-async-handler");
const busService = require("./bus.service");

exports.createBus = asyncHandler(async (req, res) => {
  const bus = await busService.createBus(req.body);

  res.status(201).json({
    success: true,
    message: "Bus created",
    data: bus,
  });
});

exports.getAllBuses = asyncHandler(async (req, res) => {
  const buses = await busService.getAllBuses();

  res.json({
    success: true,
    data: buses,
  });
});

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