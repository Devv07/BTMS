const prisma = require("../../config/prisma");

// INITIATE PAYMENT
const initiatePayment = async ({ userId, busId, amount }) => {
  const payment = await prisma.payment.create({
    data: {
      userId,
      busId,
      amount,
      status: "PENDING",
    },
  });

  return payment;
};

module.exports = {
  initiatePayment,
};