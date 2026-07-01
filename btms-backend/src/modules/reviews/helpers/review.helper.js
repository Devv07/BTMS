// average rating
const calculateAverageRating = (reviews) => {
  if (!reviews.length) {
    return 0;
  }

  const total = reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  return Number((total / reviews.length).toFixed(1));
};

// rating distribution
const calculateRatingDistribution = (reviews) => {
  const distribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  reviews.forEach((review) => {
    distribution[review.rating]++;
  });

  return distribution;
};

// rating percentages
const calculateRatingPercentages = (reviews) => {
  const distribution =
    calculateRatingDistribution(reviews);

  const total = reviews.length;

  const percentages = {};

  Object.keys(distribution).forEach((rating) => {
    percentages[rating] =
      total === 0
        ? 0
        : Number(
            (
              (distribution[rating] / total) *
              100
            ).toFixed(2)
          );
  });

  return percentages;
};

// review summary
const generateReviewSummary = (reviews) => {
  return {
    totalReviews: reviews.length,

    averageRating:
      calculateAverageRating(reviews),

    distribution:
      calculateRatingDistribution(reviews),

    percentages:
      calculateRatingPercentages(reviews),
  };
};

module.exports = {
  calculateAverageRating,
  calculateRatingDistribution,
  calculateRatingPercentages,
  generateReviewSummary,
};