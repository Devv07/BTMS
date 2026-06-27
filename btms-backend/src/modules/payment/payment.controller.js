const prisma = require("../../config/prisma");
const paymentService = require("./payment.service");

// INITIATE PAYMENT
const initiatePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { busId, amount } = req.body;

    const payment = await paymentService.initiatePayment({
      userId,
      busId,
      amount,
    });

    res.status(200).json({
      success: true,
      message: "Payment initiated",
      payment,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// PAYMENT SUCCESS (WEBHOOK / CALLBACK)
const paymentSuccess = async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;

    // 1. update payment status
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "SUCCESS",
        transactionId,
      },
    });

    // 2. get active seat locks
    const locks = await prisma.seatLock.findMany({
      where: {
        busId: payment.busId,
        userId: payment.userId,
        status: "ACTIVE",
      },
    });

    const seatIds = locks.map((l) => l.seatId);

    // 3. create booking
    const booking = await prisma.booking.create({
      data: {
        userId: payment.userId,
        busId: payment.busId,
        seatIds,
        amount: payment.amount,
        status: "CONFIRMED",
      },
    });

    // 4. update seat locks
    await prisma.seatLock.updateMany({
      where: {
        busId: payment.busId,
        userId: payment.userId,
      },
      data: {
        status: "CONFIRMED",
      },
    });

    // 5. update seats
    await prisma.seat.updateMany({
      where: { id: { in: seatIds } },
      data: {
        status: "BOOKED",
      },
    });
    

    res.status(200).json({
      success: true,
      message: "Payment successful, booking confirmed",
      booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// PAYMENT FAILED
const paymentFailed = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "FAILED",
      },
    });

    // release seat locks
    await prisma.seatLock.updateMany({
      where: {
        busId: payment.busId,
        userId: payment.userId,
      },
      data: {
        status: "EXPIRED",
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment failed, seats released",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  initiatePayment,
  paymentSuccess,
  paymentFailed,
};