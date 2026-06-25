const prisma = require("../../config/prisma");

const generateSeats = require("./seatGenerator");
// CREATE BUS
const createBus = async (data) => {
  const bus = await prisma.bus.create({
    data: {
        busName: data.busName,
        busNumber: data.busNumber,
        fromLocation: data.fromLocation,
        toLocation: data.toLocation,
        departureTime: new Date(data.departureTime),
        arrivalTime: new Date(data.arrivalTime),
        totalSeats: Number(data.totalSeats),
        availableSeats: Number(data.totalSeats),
        price: Number(data.price),
        type: data.type,
        seatConfig: data.seatConfig,
        seatLayout: data.seatLayout || {}, // Default to empty array if not provided
    },
  });

  const seats = generateSeats(data.seatConfig || {layout:"2x2", rows: 10}); // Default seat config if not provided

  await prisma.seat.createMany({
    data: seats.map((seat) => ({
      busId: bus.id,
      seatNumber: seat.seatNumber,
      type: seat.type,
      row: seat.row,
      isBooked: false,
    })),
  });

  return bus;
};

// GET ALL BUSES
const getAllBuses = async () => {
  return prisma.bus.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

// GET BUS BY ID
const getBusById = async (id) => {
  return prisma.bus.findUnique({
    where: { id },
    include: {
      bookings: true,
      seats: true,
    },
  });
};

// GET BUS SEATS
const getBusSeats = async (busId) => {
  return prisma.seat.findMany({
    where: { busId },
    orderBy: {
      seatNumber: "asc",
    },
  });
};

// SINGLE EXPORT (IMPORTANT)
module.exports = {
  createBus,
  getAllBuses,
  getBusById,
  getBusSeats,
};