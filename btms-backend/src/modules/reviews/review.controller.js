const asyncHandler = require("express-async-handler");

const reviewService = require("./review.service");

// create review
exports.createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview({
    userId: req.user.id,
    bookingId: req.body.bookingId,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  res.status(201).json({
    success: true,
    message: "Review submitted successfully",
    data: review,
  });
});

// update review
exports.updateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReview(
    req.params.id,
    req.user.id,
    req.body
  );

  res.json({
    success: true,
    message: "Review updated successfully",
    data: review,
  });
});

// delete review
exports.deleteReview = asyncHandler(async (req, res) => {
  const result = await reviewService.deleteReview(
    req.params.id,
    req.user.id
  );

  res.json(result);
});

// get all reviews
exports.getReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getReviews({
    rating: req.query.rating,
    page: req.query.page,
    limit: req.query.limit,
    search: req.query.search,
    sort: req.query.sort,
  });

  res.json({
    success: true,
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
    data: result.reviews,
  });
});

// get review
exports.getReview = asyncHandler(async (req, res) => {
  const review = await reviewService.getReview(
    req.params.id
  );

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found",
    });
  }

  res.json({
    success: true,
    data: review,
  });
});

// get reviews by bus
exports.getBusReviews = asyncHandler(async (req, res) => {
  const reviews =
    await reviewService.getBusReviews(
      req.params.busId
    );

  res.json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// get my reviews
exports.getMyReviews = asyncHandler(async (req, res) => {
  const reviews =
    await reviewService.getMyReviews(
      req.user.id
    );

  res.json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// bus review summary
exports.getBusReviewSummary =
  asyncHandler(async (req, res) => {
    const summary =
      await reviewService.getBusReviewSummary(
        req.params.busId
      );

    res.json({
      success: true,
      data: summary,
    });
  });

// top rated buses
exports.getTopRatedBuses =
  asyncHandler(async (req, res) => {
    const buses =
      await reviewService.getTopRatedBuses(
        req.query.limit
      );

    res.json({
      success: true,
      data: buses,
    });
  });

// lowest rated buses
exports.getLowestRatedBuses =
  asyncHandler(async (req, res) => {
    const buses =
      await reviewService.getLowestRatedBuses(
        req.query.limit
      );

    res.json({
      success: true,
      data: buses,
    });
  });

// recent reviews
exports.getRecentReviews =
  asyncHandler(async (req, res) => {
    const reviews =
      await reviewService.getRecentReviews(
        req.query.limit
      );

    res.json({
      success: true,
      data: reviews,
    });
  });

// rating statistics
exports.getRatingStatistics =
  asyncHandler(async (req, res) => {
    const statistics =
      await reviewService.getRatingStatistics();

    res.json({
      success: true,
      data: statistics,
    });
  });

// hide review
exports.hideReview = asyncHandler(async (req, res) => {
  const review = await reviewService.hideReview(
    req.params.id
  );

  res.json({
    success: true,
    message: "Review hidden successfully",
    data: review,
  });
});

// publish review
exports.publishReview = asyncHandler(async (req, res) => {
  const review = await reviewService.publishReview(
    req.params.id
  );

  res.json({
    success: true,
    message: "Review published successfully",
    data: review,
  });
});

// report review
exports.reportReview = asyncHandler(async (req, res) => {
  const review = await reviewService.reportReview(
    req.params.id
  );

  res.json({
    success: true,
    message: "Review reported successfully",
    data: review,
  });
});

// soft delete review
exports.softDeleteReview = asyncHandler(async (req, res) => {
  const review =
    await reviewService.softDeleteReview(
      req.params.id
    );

  res.json({
    success: true,
    message: "Review deleted successfully",
    data: review,
  });
});

// restore review
exports.restoreReview = asyncHandler(async (req, res) => {
  const review =
    await reviewService.restoreReview(
      req.params.id
    );

  res.json({
    success: true,
    message: "Review restored successfully",
    data: review,
  });
});

// dashboard statistics
exports.getDashboardStatistics =
  asyncHandler(async (req, res) => {
    const statistics =
      await reviewService.getDashboardStatistics();

    res.json({
      success: true,
      data: statistics,
    });
  });