const express = require("express");

const router = express.Router();

const dashboardController = require("./dashboard.controller");

const authMiddleware = require("../../middleware/authMiddleware");
const authorize = require("../../middleware/authorize");

router.get(
  "/",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  dashboardController.getDashboardSummary
);

router.get(
  "/bookings",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  dashboardController.getBookingAnalytics
);

router.get(
  "/revenue",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  dashboardController.getRevenueAnalytics
);

router.get(
  "/buses",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  dashboardController.getBusAnalytics
);

router.get(
  "/activity",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  dashboardController.getRecentActivity
);

router.get(
  "/charts",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  dashboardController.getChartAnalytics
);

module.exports = router;