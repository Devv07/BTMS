const prisma = require("../../config/prisma");

const PaymentFactory = require("./factory/paymentFactory");

const PaymentStatus = require("./constants/paymentStatus");

// ======================================================
// CREATE PAYMENT
// ======================================================

const createPayment = async ({
  bookingId,
  paymentMethod,
  customer = {},
}) => {
  return await prisma.$transaction(async (tx) => {
    // ------------------------------------
    // Find booking
    // ------------------------------------

    const booking = await tx.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        bus: true,
        user: true,
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status === "CANCELLED") {
      throw new Error("Booking already cancelled");
    }

    // ------------------------------------
    // Existing payment
    // ------------------------------------

    const existing = await tx.payment.findFirst({
      where: {
        bookingId,
      },
    });

    if (
      existing &&
      existing.status === PaymentStatus.SUCCESS
    ) {
      throw new Error("Payment already completed");
    }

    // ------------------------------------
    // Create payment record
    // ------------------------------------

    const payment = await tx.payment.create({
      data: {
        bookingId,
        amount: booking.totalPrice,
        method: paymentMethod,
        status: PaymentStatus.PENDING,
      },
    });

    // ------------------------------------
    // Gateway
    // ------------------------------------

    const gateway =
      PaymentFactory.create(paymentMethod, payment);

    const gatewayResponse =
      await gateway.createPayment({
        booking,
        payment,
        customer,
      });

    // ------------------------------------
    // Save transaction
    // ------------------------------------

    await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        transactionId: result.transactionId || null,
        gatewayRef: result.gatewayReference || null,
      },
    });

    return {
      success: true,
      paymentId: payment.id,

      transactionId:gatewayResponse.transactionId,
      gatewayRef:gatewayResponse.gatewayReference,
    };
  });
};

// ======================================================
// VERIFY PAYMENT
// ======================================================

const verifyPayment = async ({
  paymentId,
}) => {
  const payment =
    await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        booking: true,
      },
    });

  if (!payment) {
    throw new Error("Payment not found");
  }

  const gateway =
    PaymentFactory.create(
      payment.method,
      payment
    );

  const result =
    await gateway.verifyPayment(payment);

  if (!result.success) {
    return result;
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.SUCCESS,
      },
    });

    await tx.booking.update({
      where: {
        id: payment.bookingId,
      },
      data: {
        status: "CONFIRMED",
      },
    });
  });

  return {
    success: true,
    message: "Payment verified",
  };
};

// ======================================================
// REFUND PAYMENT
// ======================================================

const refundPayment = async ({
  paymentId,
}) => {
  const payment =
    await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
    });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (
    payment.status !==
    PaymentStatus.SUCCESS
  ) {
    throw new Error(
      "Payment is not successful"
    );
  }

  const gateway =
    PaymentFactory.create(
      payment.method,
      payment
    );

  const refund =
    await gateway.refundPayment(
      payment
    );

  if (!refund.success) {
    throw new Error(
      refund.message
    );
  }

  await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      status:
        PaymentStatus.REFUNDED,
    },
  });

  return {
    success: true,
    message:
      "Payment refunded successfully",
  };
};

// ======================================================
// WEBHOOK
// ======================================================

const handleWebhook =
  async (method, payload) => {
    const gateway =
      PaymentFactory.create(method);

    return gateway.webhook(payload);
  };

// ======================================================
// GET ALL PAYMENTS
// ======================================================

const getPayments =
  async () => {
    return prisma.payment.findMany({
      include: {
        booking: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

// ======================================================
// GET PAYMENT
// ======================================================

const getPayment =
  async (paymentId) => {
    return prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        booking: true,
      },
    });
  };

module.exports = {
  createPayment,
  verifyPayment,
  refundPayment,
  handleWebhook,
  getPayments,
  getPayment,
};