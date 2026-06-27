const prisma = require("../../config/prisma");
const { generateTicketNumber } = require("../../utils/ticket");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");


// ==============================
// CREATE BOOKING
// ==============================
const createBooking = async ({ userId, busId, seat }) => {
  return await prisma.$transaction(async (tx) => {

    // 1. Get bus
    const bus = await tx.bus.findUnique({
      where: { id: busId },
    });

    if (!bus) throw new Error("Bus not found");

    // 2. Get seats
    const seats = await tx.seat.findMany({
      where: {
        busId,
        seatNumber: { in: seat },
      },
    });

    // 3. Validate seats exist
    if (seats.length !== seat.length) {
      throw new Error("Some seats do not exist");
    }

    // 4. Check already booked / locked
    const notAvailable = seats.filter(
      (s) => s.status === "BOOKED" || s.status === "LOCKED"
    );

    if (notAvailable.length > 0) {
      throw new Error(
        `Seats already booked: ${notAvailable
          .map((s) => s.seatNumber)
          .join(", ")}`
      );
    }

    // 5. Create booking
    const booking = await tx.booking.create({
      data: {
        userId,
        busId,
        seats: seat.length,
        totalPrice: seat.length * bus.price,
        ticketNumber: generateTicketNumber(),
      },
      include: {
        bus: true,
        user: true,
      },
    });

    // 6. LOCK SEATS CORRECTLY
    await tx.seat.updateMany({
      where: {
        busId,
        seatNumber: { in: seat },
      },
      data: {
        status: "BOOKED",
        bookingId: booking.id,
      },
    });

    // 7. Update bus seats
    await tx.bus.update({
      where: { id: busId },
      data: {
        availableSeats: {
          decrement: seat.length,
        },
      },
    });

    // 8. QR CODE
    const qrCode = await QRCode.toDataURL(
      JSON.stringify({
        bookingId: booking.id,
        ticketNumber: booking.ticketNumber,
        seats: seat,
      })
    );

    return {
      ...booking,
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
  return await prisma.$transaction(async (tx) => {

    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new Error("Booking not found");

    if (role === "USER" && booking.userId !== userId) {
      throw new Error("Not authorized");
    }

    if (booking.status === "CONFIRMED") {
      throw new Error("Cannot cancel confirmed booking");
    }

    // 1. Free seats
    await tx.seat.updateMany({
      where: { bookingId },
      data: {
        status: "AVAILABLE",
        bookingId: null,
      },
    });

    // 2. Restore seats in bus
    await tx.bus.update({
      where: { id: booking.busId },
      data: {
        availableSeats: {
          increment: booking.seats,
        },
      },
    });

    // 3. Cancel booking (FIXED)
    return tx.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
      },
    });
  });
};


// ==============================
// PDF TICKET
// ==============================
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