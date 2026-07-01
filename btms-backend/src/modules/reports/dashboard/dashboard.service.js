const prisma = require("../../../config/prisma");

// dashboard summary
const getSummary = async () => {
  const [
    totalUsers,
    totalBuses,
    totalBookings,
    totalPayments,
    totalRevenue,
    availableSeats,
    bookedSeats,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.bus.count(),

    prisma.booking.count(),

    prisma.payment.count(),

    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.seat.count({
      where: {
        status: "AVAILABLE",
      },
    }),

    prisma.seat.count({
      where: {
        status: "BOOKED",
      },
    }),
  ]);

  return {
    totalUsers,
    totalBuses,
    totalBookings,
    totalPayments,
    totalRevenue: totalRevenue._sum.amount || 0,
    availableSeats,
    bookedSeats,
  };
};

// booking analytics
const getBookingAnalytics = async () => {
  const [pending, confirmed, cancelled] = await Promise.all([
    prisma.booking.count({
      where: {
        status: "PENDING",
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
  ]);

  return {
    pending,
    confirmed,
    cancelled,
  };
};

// payment analytics
const getPaymentAnalytics = async () => {
  const [pending, success, failed, refunded] = await Promise.all([
    prisma.payment.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.payment.count({
      where: {
        status: "SUCCESS",
      },
    }),

    prisma.payment.count({
      where: {
        status: "FAILED",
      },
    }),

    prisma.payment.count({
      where: {
        status: "REFUNDED",
      },
    }),
  ]);

  return {
    pending,
    success,
    failed,
    refunded,
  };
};

// revenue analytics
const getRevenueAnalytics = async () => {
  const payments = await prisma.payment.findMany({
    where: {
      status: "SUCCESS",
    },
    select: {
      amount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return payments;
};

// popular buses
const getPopularBuses = async () => {
  const buses = await prisma.bus.findMany({
    include: {
      bookings: true,
    },
  });

  return buses
    .map((bus) => ({
      id: bus.id,
      busName: bus.busName,
      busNumber: bus.busNumber,
      totalBookings: bus.bookings.length,
    }))
    .sort((a, b) => b.totalBookings - a.totalBookings);
};

// monthly revenue
const getMonthlyRevenue = async () => {
  const payments = await prisma.payment.findMany({
    where: {
      status: "SUCCESS",
    },
    select: {
      amount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const revenue = {};

  payments.forEach((payment) => {
    const month = payment.createdAt.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    revenue[month] = (revenue[month] || 0) + payment.amount;
  });

  return Object.entries(revenue).map(([month, amount]) => ({
    month,
    amount,
  }));
};

// monthly bookings
const getMonthlyBookings = async () => {
  const bookings = await prisma.booking.findMany({
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const result = {};

  bookings.forEach((booking) => {
    const month = booking.createdAt.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    result[month] = (result[month] || 0) + 1;
  });

  return Object.entries(result).map(([month, bookings]) => ({
    month,
    bookings,
  }));
};

// seat occupancy
const getSeatOccupancy = async () => {
  const totalSeats = await prisma.seat.count();

  const bookedSeats = await prisma.seat.count({
    where: {
      status: "BOOKED",
    },
  });

  const availableSeats = totalSeats - bookedSeats;

  const occupancy =
    totalSeats === 0
      ? 0
      : Number(((bookedSeats / totalSeats) * 100).toFixed(2));

  return {
    totalSeats,
    bookedSeats,
    availableSeats,
    occupancy,
  };
};

// popular routes
const getPopularRoutes = async () => {
  const buses = await prisma.bus.findMany({
    include: {
      bookings: true,
    },
  });

  return buses
    .map((bus) => ({
      route: `${bus.fromLocation} → ${bus.toLocation}`,
      bookings: bus.bookings.length,
    }))
    .sort((a, b) => b.bookings - a.bookings);
};

// payment methods
const getPaymentMethods = async () => {
  const payments = await prisma.payment.groupBy({
    by: ["method"],
    _count: true,
  });

  return payments.map((item) => ({
    method: item.method,
    total: item._count,
  }));
};



module.exports = {
  getSummary,
  getBookingAnalytics,
  getPaymentAnalytics,
  getRevenueAnalytics,
  getPopularBuses,

  getMonthlyRevenue,
  getMonthlyBookings,
  getSeatOccupancy,
  getPopularRoutes,
  getPaymentMethods,
};