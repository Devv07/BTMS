const express = require("express");

const router = express.Router();

const reportController = require("./report.controller");

const authMiddleware = require("../../middleware/authMiddleware");
const authorize = require("../../middleware/authorize");
const dashboardController = require("./dashboard/dashboard.controller");

// ========================================
// DASHBOARD SUMMARY
// GET /api/reports/dashboard
// ========================================

router.get(
  "/dashboard",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  reportController.dashboard
);

// ========================================
// REVENUE REPORT
// GET /api/reports/revenue
// ========================================

router.get(
  "/revenue",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  reportController.revenue
);

// ========================================
// BOOKING REPORT
// GET /api/reports/bookings
// ========================================

router.get(
  "/bookings",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  reportController.bookings
);

// ========================================
// PAYMENT REPORT
// GET /api/reports/payments
// ========================================

router.get(
  "/payments",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  reportController.payments
);// dashboard summary
router.get(
  "/dashboard/summary",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  dashboardController.summary
);

// booking analytics
router.get(
  "/dashboard/bookings",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  dashboardController.bookings
);

// payment analytics
router.get(
  "/dashboard/payments",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  dashboardController.payments
);

// revenue analytics
router.get(
  "/dashboard/revenue",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  dashboardController.revenue
);

// popular buses
router.get(
  "/dashboard/buses",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  dashboardController.popularBuses
);

// monthly revenue
router.get(
  "/dashboard/monthly-revenue",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  dashboardController.monthlyRevenue
);

// monthly bookings
router.get(
  "/dashboard/monthly-bookings",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  dashboardController.monthlyBookings
);

// seat occupancy
router.get(
  "/dashboard/seat-occupancy",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  dashboardController.seatOccupancy
);

// popular routes
router.get(
  "/dashboard/popular-routes",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  dashboardController.popularRoutes
);

// payment methods
router.get(
  "/dashboard/payment-methods",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  dashboardController.paymentMethods
);


module.exports = router;