const prisma = require("../../config/prisma");
const notificationService = require("../notification/notification.service");

// request refund
const requestRefund = async ({
  userId,
  bookingId,
  reason,
}) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      payment: true,
      refund: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.userId !== userId) {
    throw new Error("Unauthorized");
  }

  if (booking.status !== "CONFIRMED") {
    throw new Error(
      "Only confirmed bookings can be refunded"
    );
  }

  if (!booking.payment) {
    throw new Error("Payment not found");
  }

  if (booking.refund) {
    throw new Error(
      "Refund already requested"
    );
  }

  return prisma.refund.create({
    data: {
      bookingId,
      paymentId: booking.payment.id,
      amount: booking.totalPrice,
      reason,
      status: "PENDING",
    },
    include: {
      booking: true,
      payment: true,
    },
  });
};

// all refunds
const getRefunds = async () => {
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

// refund by id
const getRefund = async (id) => {
  return prisma.refund.findUnique({
    where: {
      id,
    },
    include: {
      booking: {
        include: {
          user: true,
          bus: true,
        },
      },
      payment: true,
    },
  });
};

// update refund status
const updateRefundStatus = async ({
  refundId,
  status,
  adminRemark,
}) => {
  const updatedRefund = await prisma.$transaction(async (tx) => {
    const refund = await tx.refund.findUnique({
      where: {
        id: refundId,
      },
      include: {
        booking: true,
        payment: true,
      },
    });

    if (!refund) {
      throw new Error("Refund not found");
    }

    if (refund.status !== "PENDING") {
      throw new Error("Refund already processed");
    }

    // Reject Refund
    if (status === "REJECTED") {
      await tx.refund.update({
        where: {
          id: refundId,
        },
        data: {
          status: "REJECTED",
          adminRemark,
        },
      });
    } else {
      // Approve Refund
      await tx.refund.update({
        where: {
          id: refundId,
        },
        data: {
          status: "APPROVED",
          adminRemark,
        },
      });

      await tx.payment.update({
        where: {
          id: refund.paymentId,
        },
        data: {
          status: "REFUNDED",
        },
      });

      await tx.booking.update({
        where: {
          id: refund.bookingId,
        },
        data: {
          status: "CANCELLED",
        },
      });

      await tx.seat.updateMany({
        where: {
          bookingId: refund.bookingId,
        },
        data: {
          status: "AVAILABLE",
          bookingId: null,
        },
      });

      await tx.bus.update({
        where: {
          id: refund.booking.busId,
        },
        data: {
          availableSeats: {
            increment: refund.booking.seats,
          },
        },
      });
    }

    return tx.refund.findUnique({
      where: {
        id: refundId,
      },
      include: {
        booking: {
          include: {
            user: true,
            bus: true,
          },
        },
        payment: true,
      },
    });
  });

  // Send Email AFTER transaction completes
  if (status === "APPROVED") {
    await notificationService.sendRefundApproved(updatedRefund);
  }

  if (status === "REJECTED") {
    await notificationService.sendRefundRejected(updatedRefund);
  }

  return updatedRefund;
};

// my refunds
const getMyRefunds = async (userId) => {
  return prisma.refund.findMany({
    where: {
      booking: {
        userId,
      },
    },
    include: {
      booking: {
        include: {
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

// refunds by user
const getRefundsByUser = async (userId) => {
  return prisma.refund.findMany({
    where: {
      booking: {
        userId,
      },
    },
    include: {
      booking: {
        include: {
          bus: true,
          user: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// refund analytics
const getRefundAnalytics = async () => {
  const [
    totalRefunds,
    pendingRefunds,
    approvedRefunds,
    rejectedRefunds,
    refundedAmount,
    recentRefunds,
  ] = await Promise.all([
    prisma.refund.count(),

    prisma.refund.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.refund.count({
      where: {
        status: "APPROVED",
      },
    }),

    prisma.refund.count({
      where: {
        status: "REJECTED",
      },
    }),

    prisma.refund.aggregate({
      where: {
        status: "APPROVED",
      },
      _sum: {
        amount: true,
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
  ]);

  return {
    totalRefunds,
    pendingRefunds,
    approvedRefunds,
    rejectedRefunds,
    totalRefundAmount:
    refundedAmount._sum.amount || 0,
    recentRefunds,
  };
};

module.exports = {
  requestRefund,
  getRefunds,
  getRefund,
  updateRefundStatus,
    getMyRefunds,
    getRefundsByUser,
};