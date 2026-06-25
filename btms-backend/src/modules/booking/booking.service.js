const prisma = require("../../config/prisma");
const { generateTicketNumber } = require("../../utils/ticket");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");


// ==============================
// CREATE BOOKING
// ==============================
const createBooking = async ({ userId, busId, seat }) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Check bus
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

    // 4. Check already booked seats
    const alreadyBooked = seats.filter((s) => s.isBooked);

    if (alreadyBooked.length > 0) {
      throw new Error(
        `Seats already booked: ${alreadyBooked
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

    // 6. Lock seats (mark as booked)
    await tx.seat.updateMany({
      where: {
        busId,
        seatNumber: { in: seat },
      },
      data: {
        isBooked: true,
        bookingId: booking.id,
      },
    });

    // 7. Reduce available seats
    await tx.bus.update({
      where: { id: busId },
      data: {
        availableSeats: {
          decrement: seat.length,
        },
      },
    });

    // 8. Generate QR Code (MERGED PART)
    const qrData = JSON.stringify({
      bookingId: booking.id,
      ticketNumber: booking.ticketNumber,
      userId: booking.userId,
      busId: booking.busId,
      seats: seat,
      totalPrice: booking.totalPrice,
      createdAt: booking.createdAt,
    });

    const qrCode = await QRCode.toDataURL(qrData);

    // 9. Return final response
    return {
      ...booking,
      qrCode,
    };
  });
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

    if (booking.status === "CONFIRMED") {
      throw new Error("Cannot cancel a confirmed booking");
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
      data:{
        status :"CANCELLED"
      }
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


// Confirm booking service
const confirmBooking = async (bookingId)=>{
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
}


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