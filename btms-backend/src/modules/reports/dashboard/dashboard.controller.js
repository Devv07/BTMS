const asyncHandler = require("express-async-handler");

const dashboardService = require("./dashboard.service");

// dashboard summary
exports.summary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSummary();

  res.json({
    success: true,
    data,
  });
});

// booking analytics
exports.bookings = asyncHandler(async (req, res) => {
  const data = await dashboardService.getBookingAnalytics();

  res.json({
    success: true,
    data,
  });
});

// payment analytics
exports.payments = asyncHandler(async (req, res) => {
  const data = await dashboardService.getPaymentAnalytics();

  res.json({
    success: true,
    data,
  });
});

// revenue analytics
exports.revenue = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRevenueAnalytics();

  res.json({
    success: true,
    data,
  });
});

// popular buses
exports.popularBuses = asyncHandler(async (req, res) => {
  const data = await dashboardService.getPopularBuses();

  res.json({
    success: true,
    data,
  });
});

// monthly revenue
exports.monthlyRevenue = asyncHandler(async (req, res) => {
  const data = await dashboardService.getMonthlyRevenue();

  res.json({
    success: true,
    data,
  });
});

// monthly bookings
exports.monthlyBookings = asyncHandler(async (req, res) => {
  const data = await dashboardService.getMonthlyBookings();

  res.json({
    success: true,
    data,
  });
});

// seat occupancy
exports.seatOccupancy = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSeatOccupancy();

  res.json({
    success: true,
    data,
  });
});

// popular routes
exports.popularRoutes = asyncHandler(async (req, res) => {
  const data = await dashboardService.getPopularRoutes();

  res.json({
    success: true,
    data,
  });
});

// payment methods
exports.paymentMethods = asyncHandler(async (req, res) => {
  const data = await dashboardService.getPaymentMethods();

  res.json({
    success: true,
    data,
  });
});