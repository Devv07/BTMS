const prisma = require("../../config/prisma");
const { generateTicketNumber } = require("../../utils/ticket");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");


// ==============================
// CREATE BOOKING
// ==============================
const createBooking = async ({ userId, busId, seats }) => {
  const bus = await prisma.bus.findUnique({
    where: { id: busId },
  });

  if (!bus) throw new Error("Bus not found");

  if (bus.availableSeats < seats) {
    throw new Error("Not enough seats available");
  }

  const ticketNumber = generateTicketNumber();

  const booking = await prisma.booking.create({
    data: {
      userId,
      busId,
      seats: Number(seats),
      totalPrice: Number(seats) * bus.price,
      ticketNumber,
    },
    include: {
      bus: true,
      user: true,
    },
  });

  // reduce seats AFTER booking
  await prisma.bus.update({
    where: { id: busId },
    data: {
      availableSeats: {
        decrement: Number(seats),
      },
    },
  });

  // 3. GENERATE QR CODE
  const QRCode = require("qrcode");

  const qrData = JSON.stringify({
    bookingId: booking.id,
    ticketNumber: booking.ticketNumber,
    userId: booking.userId,
    busId: booking.busId,
    seats: booking.seats,
    totalPrice: booking.totalPrice,
  });

  const qrCode = await QRCode.toDataURL(qrData);

  return {
    ...booking,
    qrCode,
  }
};


// ==============================
// GET ALL BOOKINGS (FILTER + PAGINATION)
// ==============================
const getAllBookings = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    sort = "latest",
    busId,
    userId,
    fromDate,
    toDate,
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const where = {};

  if (busId) where.busId = busId;
  if (userId) where.userId = userId;

  if (fromDate || toDate) {
    where.createdAt = {};
    if (fromDate) where.createdAt.gte = new Date(fromDate);
    if (toDate) where.createdAt.lte = new Date(toDate);
  }

  if (search) {
    where.OR = [
      {
        ticketNumber: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" }
      : { createdAt: "desc" };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        bus: true,
        user: true,
      },
      orderBy,
      skip,
      take: Number(limit),
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    data: bookings,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
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
    orderBy: {
      createdAt: "desc",
    },
  });
};


// ==============================
// CANCEL BOOKING (TRANSACTION SAFE)
// ==============================
const deleteBooking = async (bookingId, userId, role) => {
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (role === "USER" && booking.userId !== userId) {
      throw new Error("Not authorized");
    }

    await tx.bus.update({
      where: { id: booking.busId },
      data: {
        availableSeats: {
          increment: booking.seats,
        },
      },
    });

    return await tx.booking.delete({
      where: { id: bookingId },
    });
  });
};


// ==============================
// PDF TICKET GENERATION
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

  const qrData = JSON.stringify({
    ticketNumber: booking.ticketNumber,
    bookingId: booking.id,
    userId: booking.userId,
    busId: booking.busId,
  });

  const qrCodeImage = await QRCode.toDataURL(qrData);

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
    doc.image(qrCodeImage, { width: 150 });

    doc.end();
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
};