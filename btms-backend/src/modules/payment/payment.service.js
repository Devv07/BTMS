const prisma = require("../../config/prisma");
const PaymentFactory = require("./factory/paymentFactory");
const PaymentStatus = require("./constants/paymentStatus");
const notificationService = require("../notification/notification.service");
const bookingService = require("../booking/booking.service");

// create payment
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
        transactionId:
          gatewayResponse.transactionId || null,

        gatewayRef:
          gatewayResponse.gatewayReference || null,

        status:
          gatewayResponse.status || PaymentStatus.PENDING,
      },
    });

    return {
      success: true,

      paymentId: payment.id,

      method: paymentMethod,

      status: gatewayResponse.status,

      transactionId: gatewayResponse.transactionId,

      gatewayRef: gatewayResponse.gatewayReference,

      redirectUrl: gatewayResponse.redirectUrl || null,

      formData: gatewayResponse.formData || null,
    };
  });
};

// verify payment
const verifyPayment = async ({ paymentId }) => {
  // find payment
  const payment = await prisma.payment.findUnique({
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

  // verify with gateway
  const gateway = PaymentFactory.create(
    payment.method,
    payment
  );

  const result = await gateway.verifyPayment(payment);

  if (!result.success) {
    return result;
  }

  // update payment & booking
  const updatedBooking = await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.SUCCESS,
      },
    });

    return await tx.booking.update({
      where: {
        id: payment.bookingId,
      },
      data: {
        status: "CONFIRMED",
      },
      include: {
        user: true,
        bus: true,
      },
    });
  });

  // generate pdf
  const pdfBuffer = await bookingService.generateTicketPDF(
    updatedBooking.id
  );

  // send booking confirmation email
  await notificationService.sendBookingConfirmation({
    email: updatedBooking.user.email,
    passengerName: updatedBooking.user.fullName,
    ticketNumber: updatedBooking.ticketNumber,
    busName: updatedBooking.bus.busName,
    busNumber: updatedBooking.bus.busNumber,
    fromLocation: updatedBooking.bus.fromLocation,
    toLocation: updatedBooking.bus.toLocation,
    departureTime: new Date(
      updatedBooking.bus.departureTime
    ).toLocaleString(),
    arrivalTime: new Date(
      updatedBooking.bus.arrivalTime
    ).toLocaleString(),
    seatNumbers: Array.isArray(updatedBooking.seatIds)
      ? updatedBooking.seatIds
      : [],
    totalAmount: updatedBooking.totalPrice,
    pdfBuffer,
  });

  // get payment details
  const paymentDetails = await prisma.payment.findUnique({
    where: {
      id: payment.id,
    },
    include: {
      booking: {
        include: {
          user: true,
          bus: true,
        },
      },
    },
  });

  // send payment success email
  await notificationService.sendPaymentSuccess(paymentDetails);

  return {
    success: true,
    message: "Payment verified successfully",
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