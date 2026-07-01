const express = require("express");

const router = express.Router();

const reviewController = require("./review.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

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
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
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

module.exports = router;