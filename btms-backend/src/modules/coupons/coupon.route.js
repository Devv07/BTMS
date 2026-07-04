const express = require("express");

const router = express.Router();

const couponController = require("./coupon.controller");

const authMiddleware = require("../../middleware/authMiddleware");
const authorize = require("../../middleware/authorize");

// create coupon
router.post(
  "/",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  couponController.createCoupon
);

// get all coupons
router.get(
  "/",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  couponController.getCoupons
);

// apply coupon
router.post(
  "/apply",
  authMiddleware,
  couponController.applyCoupon
);

// get coupon
router.get(
  "/:id",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  couponController.getCoupon
);

// update coupon
router.patch(
  "/:id",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  couponController.updateCoupon
);

// delete coupon
router.delete(
  "/:id",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  couponController.deleteCoupon
);

// status update coupon
router.patch(
  "/:id/status",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  couponController.updateCouponStatus
);

// get coupon analytics
router.get(
  "/analytics",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  couponController.getCouponAnalytics
);

module.exports = router;
