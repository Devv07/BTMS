const asyncHandler = require("express-async-handler");

const reportService = require("./report.service");

// dashboard report
exports.dashboard = asyncHandler(async (req, res) => {
  const report = await reportService.getDashboardReport();

  res.json({
    success: true,
    data: report,
  });
});

// revenue report
exports.revenue = asyncHandler(async (req, res) => {
  const report = await reportService.getRevenueReport(req.query);

  res.json({
    success: true,
    data: report,
  });
});

// booking report
exports.bookings = asyncHandler(async (req, res) => {
  const report = await reportService.getBookingReport(req.query);

  res.json({
    success: true,
    count: report.length,
    data: report,
  });
});

// payment report
exports.payments = asyncHandler(async (req, res) => {
  const report = await reportService.getPaymentReport(req.query);

  res.json({
    success: true,
    count: report.length,
    data: report,
  });
});