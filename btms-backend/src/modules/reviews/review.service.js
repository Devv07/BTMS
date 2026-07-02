const prisma = require("../../config/prisma");


const {
 generateReviewSummary,
} = require("./helpers/review.helper");

// bus review summary
const getBusReviewSummary = async (busId) => {
  const reviews = await prisma.review.findMany({
    where: {
      busId,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    busId,
    ...generateReviewSummary(reviews),
    reviews,
  };
};

// create review
const createReview = async ({
  userId,
  bookingId,
  rating,
  comment,
}) => {
  // find booking
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      bus: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // booking owner
  if (booking.userId !== userId) {
    throw new Error("You can only review your own booking");
  }

  // booking status
  if (booking.status !== "CONFIRMED") {
    throw new Error("Only confirmed bookings can be reviewed");
  }

  // already reviewed
  const existingReview = await prisma.review.findUnique({
    where: {
      bookingId,
    },
  });

  if (existingReview) {
    throw new Error("Review already submitted");
  }

  // create review
  return prisma.review.create({
    data: {
      userId,
      busId: booking.busId,
      bookingId,
      rating,
      comment,
    },
    include: {
      user: true,
      bus: true,
      booking: true,
    },
  });
};

// update review
const updateReview = async (
  reviewId,
  userId,
  data
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return prisma.review.update({
    where: {
      id: reviewId,
    },
    data,
    include: {
      user: true,
      bus: true,
      booking: true,
    },
  });
};

// delete review
const deleteReview = async (
  reviewId,
  userId
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  return {
    success: true,
    message: "Review deleted successfully",
  };
};

// get all reviews
const getReviews = async ({
  rating,
  page = 1,
  limit = 10,
  search,
  sort = "newest",
}) => {
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const where = {};

  if (rating) {
    where.rating = Number(rating);
  }

  if (search) {
    where.OR = [
      {
        comment: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        user: {
          fullName: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        bus: {
          busName: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  let orderBy = {
    createdAt: "desc",
  };

  switch (sort) {
    case "oldest":
      orderBy = {
        createdAt: "asc",
      };
      break;

    case "highest":
      orderBy = {
        rating: "desc",
      };
      break;

    case "lowest":
      orderBy = {
        rating: "asc",
      };
      break;

    default:
      orderBy = {
        createdAt: "desc",
      };
  }

  const total = await prisma.review.count({
    where,
  });

  const reviews = await prisma.review.findMany({
    where,
    skip,
    take: limit,
    include: {
      user: true,
      bus: true,
      booking: true,
    },
    orderBy,
  });

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    reviews,
  };
};

// get review
const getReview = async (reviewId) => {
  return prisma.review.findUnique({
    where: {
      id: reviewId,
    },
    include: {
      user: true,
      bus: true,
      booking: true,
    },
  });
};

// get reviews by bus
const getBusReviews = async (busId) => {
  return prisma.review.findMany({
    where: {
      busId,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// get my reviews
const getMyReviews = async (userId) => {
  return prisma.review.findMany({
    where: {
      userId,
    },
    include: {
      bus: true,
      booking: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// top rated buses
const getTopRatedBuses = async (limit = 5) => {
  limit = Number(limit);

  const buses = await prisma.review.groupBy({
    by: ["busId"],

    _avg: {
      rating: true,
    },

    _count: {
      rating: true,
    },

    orderBy: {
      _avg: {
        rating: "desc",
      },
    },

    take: limit,
  });

  return Promise.all(
    buses.map(async (item) => {
      const bus = await prisma.bus.findUnique({
        where: {
          id: item.busId,
        },
      });

      return {
        bus,
        averageRating: Number(
          item._avg.rating.toFixed(1)
        ),
        totalReviews: item._count.rating,
      };
    })
  );
};

// lowest rated buses
const getLowestRatedBuses = async (
  limit = 5
) => {
  limit = Number(limit);

  const buses = await prisma.review.groupBy({
    by: ["busId"],

    _avg: {
      rating: true,
    },

    _count: {
      rating: true,
    },

    orderBy: {
      _avg: {
        rating: "asc",
      },
    },

    take: limit,
  });

  return Promise.all(
    buses.map(async (item) => {
      const bus = await prisma.bus.findUnique({
        where: {
          id: item.busId,
        },
      });

      return {
        bus,
        averageRating: Number(
          item._avg.rating.toFixed(1)
        ),
        totalReviews: item._count.rating,
      };
    })
  );
};

// recent reviews
const getRecentReviews = async (
  limit = 10
) => {
  return prisma.review.findMany({
    take: Number(limit),

    include: {
      user: true,
      bus: true,
      booking: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

// rating statistics
const getRatingStatistics = async () => {
  const reviews =
    await prisma.review.findMany();

  return generateReviewSummary(reviews);
};


// hide review
const hideReview = async (reviewId) => {
  return prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      status: "HIDDEN",
    },
  });
};

// publish review
const publishReview = async (reviewId) => {
  return prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      status: "PUBLISHED",
    },
  });
};

// report review
const reportReview = async (reviewId) => {
  return prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      status: "REPORTED",
    },
  });
};

// soft delete review
const softDeleteReview = async (reviewId) => {
  return prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      isDeleted: true,
    },
  });
};

// restore review
const restoreReview = async (reviewId) => {
  return prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      isDeleted: false,
    },
  });
};

// dashboard statistics
const getDashboardStatistics = async () => {
  const [
    totalReviews,
    published,
    hidden,
    reported,
    deleted,
    reviews,
  ] = await Promise.all([
    prisma.review.count(),

    prisma.review.count({
      where: {
        status: "PUBLISHED",
      },
    }),

    prisma.review.count({
      where: {
        status: "HIDDEN",
      },
    }),

    prisma.review.count({
      where: {
        status: "REPORTED",
      },
    }),

    prisma.review.count({
      where: {
        isDeleted: true,
      },
    }),

    prisma.review.findMany({
      where: {
        isDeleted: false,
      },
    }),
  ]);

  return {
    totalReviews,
    published,
    hidden,
    reported,
    deleted,
    averageRating:
      generateReviewSummary(reviews).averageRating,
  };
};



module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReviews,
  getReview,
  getBusReviews,
  getMyReviews,
  getBusReviewSummary,
  getTopRatedBuses,
  getLowestRatedBuses,
  getRecentReviews,
  getRatingStatistics,
  hideReview,
  publishReview,
  reportReview,
  softDeleteReview,
  restoreReview,
  getDashboardStatistics,
};