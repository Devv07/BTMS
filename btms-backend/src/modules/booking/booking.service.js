const prisma = require("../../config/prisma");
const { generateTicketNumber } = require("../../utils/ticket");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const notificationService = require("../notification/notification.service");

const createBooking = async ({ userId, busId, seatNumbers }) => {
  return await prisma.$transaction(async (tx) => {

    // 1. Get bus
    const bus = await tx.bus.findUnique({
      where: { id: busId },
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

    // 5. Create booking
    const booking = await tx.booking.create({
      data: {
        userId,
        busId,

        seatIds: seatNumbers,   // <-- ADD THIS

        seats: seatNumbers.length,
        amount: seatNumbers.length * bus.price,
        totalPrice: seatNumbers.length * bus.price,
        ticketNumber: generateTicketNumber(),
      },
      include: {
        bus: true,
        user: true,
      },
    });

    // 6. Book seats
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

    // 7. Update available seats
    await tx.bus.update({
      where: {
        id: busId,
      },
      data: {
        availableSeats: {
          decrement: seatNumbers.length,
        },
      },
    });

    // 8. Generate QR Code
    const qrCode = await QRCode.toDataURL(
      JSON.stringify({
        bookingId: booking.id,
        ticketNumber: booking.ticketNumber,
        seatNumbers,
      })
    );

    return {
      ...booking,
      seatNumbers,
      qrCode,
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