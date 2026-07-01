const express = require("express");

const router = express.Router();

const reportController = require("./report.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");
const dashboardController = require("./dashboard/dashboard.controller");

// ========================================
// DASHBOARD SUMMARY
// GET /api/reports/dashboard
// ========================================

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  reportController.dashboard
);

// ========================================
// REVENUE REPORT
// GET /api/reports/revenue
// ========================================

router.get(
  "/revenue",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  reportController.revenue
);

// ========================================
// BOOKING REPORT
// GET /api/reports/bookings
// ========================================

router.get(
  "/bookings",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  reportController.bookings
);

// ========================================
// PAYMENT REPORT
// GET /api/reports/payments
// ========================================

router.get(
  "/payments",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  reportController.payments
);// dashboard summary
router.get(
  "/dashboard/summary",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  dashboardController.summary
);

// booking analytics
router.get(
  "/dashboard/bookings",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  dashboardController.bookings
);

// payment analytics
router.get(
  "/dashboard/payments",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  dashboardController.payments
);

// revenue analytics
router.get(
  "/dashboard/revenue",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  dashboardController.revenue
);

// popular buses
router.get(
  "/dashboard/buses",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  dashboardController.popularBuses
);

// monthly revenue
router.get(
  "/dashboard/monthly-revenue",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  dashboardController.monthlyRevenue
);

// monthly bookings
router.get(
  "/dashboard/monthly-bookings",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  dashboardController.monthlyBookings
);

// seat occupancy
router.get(
  "/dashboard/seat-occupancy",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  dashboardController.seatOccupancy
);

// popular routes
router.get(
  "/dashboard/popular-routes",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  dashboardController.popularRoutes
);

// payment methods
router.get(
  "/dashboard/payment-methods",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  dashboardController.paymentMethods
);


module.exports = router;