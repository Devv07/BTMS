const prisma = require("../../config/prisma");

// HOLD SEATS (TEMP LOCK)
const holdSeats = async ({ busId, seatNumbers }) => {
  const now = new Date();
  const expiry = new Date(now.getTime() + 5 * 60 * 1000); // 5 min

  return await prisma.$transaction(async (tx) => {
    const seats = await tx.seat.findMany({
      where: {
        busId,
        seatNumber: { in: seatNumbers },
      },
    });

    if (seats.length !== seatNumbers.length) {
      throw new Error("Some seats not found");
    }

    // ❌ already booked or active hold
    const unavailable = seats.filter(
      (s) => s.isBooked || (s.isHeld && s.holdExpiry > now)
    );

    if (unavailable.length > 0) {
      throw new Error(
        `Seats not available: ${unavailable.map((s) => s.seatNumber).join(", ")}`
      );
    }

    // ✅ HOLD SEATS
    await tx.seat.updateMany({
      where: {
        busId,
        seatNumber: { in: seatNumbers },
      },
      data: {
        isHeld: true,
        holdExpiry: expiry,
      },
    });

    return {
      message: "Seats held successfully",
      expiresAt: expiry,
    };
  });
};

module.exports = {
  holdSeats,
};