const express = require("express");

const router = express.Router();

const reviewController = require("./review.controller");

const authMiddleware = require("../../middleware/authMiddleware");
const authorize = require("../../middleware/authorize");

// create review
router.post(
  "/",
  authMiddleware,
  reviewController.createReview
);

// get all reviews
router.get(
  "/",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  reviewController.getReviews
);

// get my reviews
router.get(
  "/my",
  authMiddleware,
  reviewController.getMyReviews
);

// bus review summary
router.get(
  "/bus/:busId/summary",
  reviewController.getBusReviewSummary
);

// get reviews by bus
router.get(
  "/bus/:busId",
  reviewController.getBusReviews
);

// top rated buses
router.get(
  "/top-rated",
  reviewController.getTopRatedBuses
);

// lowest rated buses
router.get(
  "/lowest-rated",
  reviewController.getLowestRatedBuses
);

// recent reviews
router.get(
  "/recent",
  reviewController.getRecentReviews
);

// rating statistics
router.get(
  "/statistics",
  reviewController.getRatingStatistics
);

// get review
router.get(
  "/:id",
  reviewController.getReview
);

// update review
router.patch(
  "/:id",
  authMiddleware,
  reviewController.updateReview
);

// delete review
router.delete(
  "/:id",
  authMiddleware,
  reviewController.deleteReview
);

// dashboard statistics
router.get(
  "/dashboard",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  reviewController.getDashboardStatistics
);

// hide review
router.patch(
  "/:id/hide",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  reviewController.hideReview
);

// publish review
router.patch(
  "/:id/publish",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  reviewController.publishReview
);

// report review
router.patch(
  "/:id/report",
  authMiddleware,
  reviewController.reportReview
);

// restore review
router.patch(
  "/:id/restore",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  reviewController.restoreReview
);

// soft delete review
router.delete(
  "/:id/soft",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  reviewController.softDeleteReview
);

module.exports = router;