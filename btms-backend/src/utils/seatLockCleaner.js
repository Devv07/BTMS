const prisma = require("../config/prisma");

const cleanExpiredSeatLocks = async () => {
  try {
    const now = new Date();

    // 1. find expired ACTIVE locks
    const expiredLocks = await prisma.seatLock.findMany({
      where: {
        status: "ACTIVE",
        expiresAt: {
          lt: now,
        },
      },
    });

    if (expiredLocks.length === 0) {
      console.log("🟢 No expired seat locks found");
      return;
    }

    const lockIds = expiredLocks.map((l) => l.id);
    const seatIds = expiredLocks.map((l) => l.seatId);

    // 2. mark locks as EXPIRED
    await prisma.seatLock.updateMany({
      where: {
        id: { in: lockIds },
      },
      data: {
        status: "EXPIRED",
      },
    });

    // 3. free seats (VERY IMPORTANT)
    await prisma.seat.updateMany({
      where: {
        id: { in: seatIds },
      },
      data: {
        status: "AVAILABLE",
      },
    });

    console.log(
      `🧹 Cleaned ${expiredLocks.length} expired seat locks`
    );
  } catch (err) {
    console.error("❌ Seat lock cleaner error:", err.message);
  }


};

module.exports = cleanExpiredSeatLocks;