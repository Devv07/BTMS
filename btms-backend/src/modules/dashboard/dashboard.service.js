const prisma = require("../../config/prisma");

const getDashboardSummary = async () => {
  const [
    totalUsers,
    totalBuses,
    totalRoutes,
    totalBookings,
    totalPayments,
    totalRefunds,
    totalReviews,
    revenue,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.bus.count(),

    prisma.route.count(),

    prisma.booking.count(),

    prisma.payment.count(),

    prisma.refund.count(),

    prisma.review.count(),

    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    totalUsers,
    totalBuses,
    totalRoutes,
    totalBookings,
    totalPayments,
    totalRefunds,
    totalReviews,
    totalRevenue: revenue._sum.amount || 0,
  };
};

// booking analytics
const getBookingAnalytics = async () => {
  const today = new Date();

  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const startOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );

  const endOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    0,
    23,
    59,
    59,
    999
  );

  const [
    todayBookings,
    monthBookings,
    lastMonthBookings,
    confirmedBookings,
    cancelledBookings,
    pendingBookings,
  ] = await Promise.all([
    prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    }),

    prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),

    prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    }),

    prisma.booking.count({
      where: {
        status: "CONFIRMED",
      },
    }),

    prisma.booking.count({
      where: {
        status: "CANCELLED",
      },
    }),

    prisma.booking.count({
      where: {
        status: "PENDING",
      },
    }),
  ]);

  return {
    todayBookings,
    monthBookings,
    lastMonthBookings,
    confirmedBookings,
    cancelledBookings,
    pendingBookings,
  };
};

const getRevenueAnalytics = async () => {
  const today = new Date();

  // Today
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  // Week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // Month
  const startOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  // Year
  const startOfYear = new Date(
    today.getFullYear(),
    0,
    1
  );

  const [
    todayRevenue,
    weeklyRevenue,
    monthlyRevenue,
    yearlyRevenue,
    totalRevenue,
  ] = await Promise.all([
    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
        createdAt: {
          gte: startOfWeek,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
        createdAt: {
          gte: startOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
        createdAt: {
          gte: startOfYear,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    todayRevenue: todayRevenue._sum.amount || 0,
    weeklyRevenue: weeklyRevenue._sum.amount || 0,
    monthlyRevenue: monthlyRevenue._sum.amount || 0,
    yearlyRevenue: yearlyRevenue._sum.amount || 0,
    totalRevenue: totalRevenue._sum.amount || 0,
  };
};

// bus analytics
const getBusAnalytics = async () => {
  const [
    mostBookedBuses,
    leastBookedBuses,
    highestRatedBuses,
    lowestRatedBuses,
  ] = await Promise.all([

    // Most booked buses
    prisma.bus.findMany({
      take: 5,
      orderBy: {
        bookings: {
          _count: "desc",
        },
      },
      include: {
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    }),

    // Least booked buses
    prisma.bus.findMany({
      take: 5,
      orderBy: {
        bookings: {
          _count: "asc",
        },
      },
      include: {
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    }),

    // Highest rated buses
    prisma.bus.findMany({
      take: 5,
      orderBy: {
        averageRating: "desc",
      },
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    }),

    // Lowest rated buses
    prisma.bus.findMany({
      take: 5,
      orderBy: {
        averageRating: "asc",
      },
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    }),
  ]);

  const buses = await prisma.bus.findMany({
    select: {
      id: true,
      busNumber: true,
      totalSeats: true,
      availableSeats: true,
    },
  });

  const occupancy = buses.map((bus) => ({
    id: bus.id,
    busNumber: bus.busNumber,
    totalSeats: bus.totalSeats,
    bookedSeats: bus.totalSeats - bus.availableSeats,
    availableSeats: bus.availableSeats,
    occupancyRate:
      bus.totalSeats === 0
        ? 0
        : Number(
            (
              ((bus.totalSeats - bus.availableSeats) /
                bus.totalSeats) *
              100
            ).toFixed(2)
          ),
  }));

  return {
    mostBookedBuses,
    leastBookedBuses,
    highestRatedBuses,
    lowestRatedBuses,
    occupancy,
  };
};

// recent Activities
const getRecentActivity = async () => {
  const [
    recentBookings,
    recentPayments,
    recentRefunds,
    recentReviews,
  ] = await Promise.all([

    prisma.booking.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        bus: true,
      },
    }),

    prisma.payment.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        booking: {
          include: {
            user: true,
            bus: true,
          },
        },
      },
    }),

    prisma.refund.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        booking: {
          include: {
            user: true,
            bus: true,
          },
        },
      },
    }),

    prisma.review.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        bus: true,
      },
    }),
  ]);

  return {
    recentBookings,
    recentPayments,
    recentRefunds,
    recentReviews,
  };
};

// chart Analytics
const getChartAnalytics = async () => {
  const now = new Date();

  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    return {
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      label: `${date.getFullYear()}-${date.getMonth() + 1}`,
    };
  }).reverse();

  const bookings = await Promise.all(
    last12Months.map(async (m) => {
      const count = await prisma.booking.count({
        where: {
          createdAt: {
            gte: new Date(m.year, m.month - 1, 1),
            lt: new Date(m.year, m.month, 1),
          },
        },
      });

      return {
        label: m.label,
        bookings: count,
      };
    })
  );

  const revenue = await Promise.all(
    last12Months.map(async (m) => {
      const result = await prisma.payment.aggregate({
        where: {
          status: "SUCCESS",
          createdAt: {
            gte: new Date(m.year, m.month - 1, 1),
            lt: new Date(m.year, m.month, 1),
          },
        },
        _sum: {
          amount: true,
        },
      });

      return {
        label: m.label,
        revenue: result._sum.amount || 0,
      };
    })
  );

  const users = await Promise.all(
    last12Months.map(async (m) => {
      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(m.year, m.month - 1, 1),
            lt: new Date(m.year, m.month, 1),
          },
        },
      });

      return {
        label: m.label,
        users: count,
      };
    })
  );

  return {
    bookings,
    revenue,
    users,
  };
};


module.exports = {
    getDashboardSummary,
    getBookingAnalytics,
    getRevenueAnalytics,
    getBusAnalytics,
    getRecentActivity,
    getChartAnalytics,
};