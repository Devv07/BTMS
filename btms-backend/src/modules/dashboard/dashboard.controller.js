const dashboardService = require("./dashboard.service");

exports.getDashboardSummary = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await dashboardService.getDashboardSummary();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookingAnalytics = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await dashboardService.getBookingAnalytics();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// revenue analytics
exports.getRevenueAnalytics = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await dashboardService.getRevenueAnalytics();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// bus analytics
exports.getBusAnalytics = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await dashboardService.getBusAnalytics();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecentActivity = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await dashboardService.getRecentActivity();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// chart analytics
exports.getChartAnalytics = async (req, res, next) => {
  try {
    const data =
      await dashboardService.getChartAnalytics();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};