const prisma = require("../../config/prisma");
const { generateTicketNumber } = require("../../utils/ticket");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const notificationService = require("../notification/notification.service");

const createBooking = async ({
  userId,
  busId,
  seatNumbers,
  couponCode,
}) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Get bus
    const bus = await tx.bus.findUnique({
      where: {
        id: busId,
      },
    });

    if (!bus) {
      throw new Error("Bus not found");
    }

    // 2. Get seats
    const seats = await tx.seat.findMany({
      where: {
        busId,
        seatNumber: {
          in: seatNumbers,
        },
      },
    });

    // 3. Validate seats
    if (seats.length !== seatNumbers.length) {
      throw new Error("Some seats do not exist");
    }

    // 4. Check unavailable seats
    const unavailableSeats = seats.filter(
      (seat) =>
        seat.status === "BOOKED" ||
        seat.status === "LOCKED"
    );

    if (unavailableSeats.length > 0) {
      throw new Error(
        `Seats already booked: ${unavailableSeats
          .map((seat) => seat.seatNumber)
          .join(", ")}`
      );
    }

    // 5. Calculate amount
    const amount =
      seatNumbers.length * bus.price;

    let totalPrice = amount;

    let coupon = null;
    let couponDiscount = 0;

    // 6. Apply coupon
    if (couponCode) {
      coupon = await tx.coupon.findUnique({
        where: {
          code: couponCode.toUpperCase(),
        },
      });

      if (!coupon) {
        throw new Error("Invalid coupon");
      }

      if (coupon.status !== "ACTIVE") {
        throw new Error("Coupon is inactive");
      }

      const now = new Date();

      if (
        coupon.startDate > now ||
        coupon.expiryDate < now
      ) {
        throw new Error("Coupon has expired");
      }

      if (
        coupon.minimumAmount &&
        amount < coupon.minimumAmount
      ) {
        throw new Error(
          `Minimum booking amount is NPR ${coupon.minimumAmount}`
        );
      }

      if (
        coupon.maxUses &&
        coupon.usedCount >=
          coupon.maxUses
      ) {
        throw new Error(
          "Coupon usage limit exceeded"
        );
      }

      const previousUsage =
        await tx.booking.count({
          where: {
            userId,
            couponId: coupon.id,
          },
        });

      if (
        previousUsage >=
        coupon.perUserLimit
      ) {
        throw new Error(
          "Coupon usage limit reached"
        );
      }

      if (
        coupon.discountType ===
        "PERCENTAGE"
      ) {
        couponDiscount =
          (amount *
            coupon.discountValue) /
          100;

        if (
          coupon.maximumDiscount &&
          couponDiscount >
            coupon.maximumDiscount
        ) {
          couponDiscount =
            coupon.maximumDiscount;
        }
      } else {
        couponDiscount =
          coupon.discountValue;
      }

      totalPrice =
        amount - couponDiscount;

      if (totalPrice < 0) {
        totalPrice = 0;
      }
    }

    // 7. Create booking
    const booking =
      await tx.booking.create({
        data: {
          userId,
          busId,

          seatIds: seatNumbers,

          seats: seatNumbers.length,

          amount,

          couponId: coupon
            ? coupon.id
            : null,

          couponDiscount,

          totalPrice,

          ticketNumber:
            generateTicketNumber(),
        },
        include: {
          bus: true,
          user: true,
          coupon: true,
        },
      });

    // 8. Book seats
    await tx.seat.updateMany({
      where: {
        busId,
        seatNumber: {
          in: seatNumbers,
        },
      },
      data: {
        status: "BOOKED",
        bookingId: booking.id,
      },
    });

    // 9. Update available seats
    await tx.bus.update({
      where: {
        id: busId,
      },
      data: {
        availableSeats: {
          decrement:
            seatNumbers.length,
        },
      },
    });

    // 10. Generate QR
    const qrCode =
      await QRCode.toDataURL(
        JSON.stringify({
          bookingId:
            booking.id,
          ticketNumber:
            booking.ticketNumber,
          seatNumbers,
        })
      );

    return {
      ...booking,
      seatNumbers,
      qrCode,
      coupon: coupon
        ? {
            code: coupon.code,
            discount:
              couponDiscount,
          }
        : null,
    };
  });
};

// ==============================
// GET ALL BOOKINGS
// ==============================
const getAllBookings = async (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const skip = (page - 1) * limit;

  const where = {};

  if (query.busId) where.busId = query.busId;
  if (query.userId) where.userId = query.userId;

  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        bus: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
};


// ==============================
// GET BOOKING BY ID
// ==============================
const getBookingById = async (id) => {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      bus: true,
      user: true,
    },
  });
};


// ==============================
// GET BOOKINGS BY BUS ID
// ==============================
const getBookingsByBusId = async (busId) => {
  return prisma.booking.findMany({
    where: { busId },
    include: {
      bus: true,
      user: true,
    },
  });
};


// ==============================
// MY BOOKINGS
// ==============================
const getMyBookings = async (userId) => {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      bus: true,
    },
    orderBy: { createdAt: "desc" },
  });
};


// ==============================
// CANCEL BOOKING (FIXED)
// ==============================
const deleteBooking = async (bookingId, userId, role) => {
  const booking = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        bus: true,
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (role === "USER" && booking.userId !== userId) {
      throw new Error("Not authorized");
    }

    if (booking.status === "CONFIRMED") {
      throw new Error("Cannot cancel confirmed booking");
    }

    // Release seats
    await tx.seat.updateMany({
      where: {
        bookingId,
      },
      data: {
        status: "AVAILABLE",
        bookingId: null,
      },
    });

    // Restore available seats
    await tx.bus.update({
      where: {
        id: booking.busId,
      },
      data: {
        availableSeats: {
          increment: booking.seats,
        },
      },
    });

    // Cancel booking
    const updatedBooking = await tx.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "CANCELLED",
      },
      include: {
        user: true,
        bus: true,
      },
    });

    return updatedBooking;
  });

  // Send cancellation email
  await notificationService.sendBookingCancelled(booking);

  return booking;
};

// pdf ticket
const generateTicketPDF = async (bookingId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      bus: true,
      user: true,
    },
  });

  if (!booking) throw new Error("Booking not found");

  const qrCode = await QRCode.toDataURL(
    JSON.stringify({
      ticketNumber: booking.ticketNumber,
      bookingId: booking.id,
    })
  );

  const doc = new PDFDocument();
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));

  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    doc.fontSize(20).text("BUS TICKET", { align: "center" });

    doc.moveDown();
    doc.fontSize(12).text(`Ticket: ${booking.ticketNumber}`);
    doc.text(`Passenger: ${booking.user.fullName}`);
    doc.text(`Bus: ${booking.bus.busNumber}`);
    doc.text(`Seats: ${booking.seats}`);
    doc.text(`Total: ${booking.totalPrice}`);

    doc.moveDown();
    doc.image(qrCode, { width: 150 });

    doc.end();
  });
};


// ==============================
// CONFIRM BOOKING
// ==============================
const confirmBooking = async (bookingId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) throw new Error("Booking not found");

  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CONFIRMED",
    },
  });
};


// ==============================
// EXPORTS
// ==============================
module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByBusId,
  getMyBookings,
  deleteBooking,
  generateTicketPDF,
  confirmBooking,
};