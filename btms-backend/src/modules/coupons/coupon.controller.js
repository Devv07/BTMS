const asyncHandler = require("express-async-handler");

const couponService = require("./coupon.service");

// create coupon
exports.createCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.createCoupon(
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    data: coupon,
  });
});

// update coupon
exports.updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.updateCoupon(
    req.params.id,
    req.body
  );

  res.json({
    success: true,
    message: "Coupon updated successfully",
    data: coupon,
  });
});

// delete coupon
exports.deleteCoupon = asyncHandler(async (req, res) => {
  const result = await couponService.deleteCoupon(
    req.params.id
  );

  res.json(result);
});

// get coupon
exports.getCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.getCoupon(
    req.params.id
  );

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: "Coupon not found",
    });
  }

  res.json({
    success: true,
    data: coupon,
  });
});

// get all coupons
exports.getCoupons = asyncHandler(async (req, res) => {
  const coupons = await couponService.getCoupons();

  res.json({
    success: true,
    count: coupons.length,
    data: coupons,
  });
});

// apply coupon
exports.applyCoupon = asyncHandler(async (req, res) => {
  const result = await couponService.applyCoupon({
    code: req.body.code,
    totalAmount: req.body.totalAmount,
    userId: req.user.id,
  });

  res.json({
    success: true,
    message: "Coupon applied successfully",
    data: result,
  });
});

// update coupon status
exports.updateCouponStatus = asyncHandler(async (req, res) => {
  const coupon =
    await couponService.updateCouponStatus(
      req.params.id,
      req.body.status
    );

  res.json({
    success: true,
    message: "Coupon status updated successfully",
    data: coupon,
  });
});

// coupon analytics
exports.getCouponAnalytics = asyncHandler(async (req, res) => {
  const analytics =
    await couponService.getCouponAnalytics();

  res.json({
    success: true,
    data: analytics,
  });
});