const prisma = require("../../config/prisma");

// dashboard report
const getDashboardReport = async () => {
  const [
    totalUsers,
    totalBuses,
    totalBookings,
    totalPayments,
    confirmedBookings,
    cancelledBookings,
    totalRevenue,
    availableSeats,
    bookedSeats,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.bus.count(),

    prisma.booking.count(),

    prisma.payment.count(),

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

    prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: "SUCCESS",
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
    confirmedBookings,
    cancelledBookings,
    totalRevenue: totalRevenue._sum.amount || 0,
    availableSeats,
    bookedSeats,
  };
};

// revenue report
const getRevenueReport = async () => {
  const payments = await prisma.payment.findMany({
    where: {
      status: "SUCCESS",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      booking: true,
    },
  });

  const totalRevenue = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  return {
    totalRevenue,
    totalTransactions: payments.length,
    payments,
  };
};

// booking report
const getBookingReport = async () => {
  return prisma.booking.findMany({
    include: {
      user: true,
      bus: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// payment report
const getPaymentReport = async () => {
  return prisma.payment.findMany({
    include: {
      booking: {
        include: {
          user: true,
          bus: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// refund report
const getRefundReport = async () => {
  return prisma.refund.findMany({
    include: {
      booking: {
        include: {
          user: true,
          bus: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

module.exports = {
  getDashboardReport,
  getRevenueReport,
  getBookingReport,
  getPaymentReport,
  getRefundReport,
};