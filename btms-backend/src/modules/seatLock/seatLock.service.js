const prisma = require("../../config/prisma");

// LOCK SEAT (5 minutes)
const lockSeat = async ({ seatId, busId, userId }) => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  // 1. check if already locked
  const existingLock = await prisma.seatLock.findFirst({
    where: {
      seatId,
      status: "ACTIVE",
      expiresAt: { gt: new Date() },
    },
  });

  if (existingLock) {
    throw new Error("Seat already locked");
  }

  // 2. create lock
  const lock = await prisma.seatLock.create({
    data: {
      seatId,
      busId,
      userId,
      expiresAt,
    },
  });

  // 3. mark seat as locked (optional but useful)
  await prisma.seat.update({
    where: { id: seatId },
    data: { status: "LOCKED" },
  });

  return lock;
};