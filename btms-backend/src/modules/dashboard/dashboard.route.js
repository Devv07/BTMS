const express = require("express");

const router = express.Router();

const dashboardController = require("./dashboard.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  dashboardController.getDashboardSummary
);

router.get(
  "/bookings",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  dashboardController.getBookingAnalytics
);

router.get(
  "/revenue",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  dashboardController.getRevenueAnalytics
);

router.get(
  "/buses",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  dashboardController.getBusAnalytics
);

router.get(
  "/activity",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  dashboardController.getRecentActivity
);

router.get(
  "/charts",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  dashboardController.getChartAnalytics
);

module.exports = router;