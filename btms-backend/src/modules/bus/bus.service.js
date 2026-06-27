const prisma = require("../../config/prisma");
const generateSeats = require("../../utils/seatGenerator");

// CREATE BUS
const createBus = async (data) => {

  const seatLayout = generateSeats(data.seatConfig);

  const bus = await prisma.bus.create({
    data: {
      busName: data.busName,
      busNumber: data.busNumber,
      fromLocation: data.fromLocation,
      toLocation: data.toLocation,
      departureTime: new Date(data.departureTime),
      arrivalTime: new Date(data.arrivalTime),
      totalSeats: data.totalSeats,
      availableSeats: data.totalSeats,
      price: data.price,
      type: data.type,

      seatConfig: data.seatConfig,
      seatLayout: seatLayout,
    },
  });

  const seats = seatLayout.map((s) => ({
    ...s,
    busId: bus.id,
  }));

  await prisma.seat.createMany({
    data: seats,
  });

  return bus;
};

// GET ALL BUSES
const getAllBuses = async () => {
  return prisma.bus.findMany({
    orderBy: { createdAt: "desc" },
  });
};

// GET BUS BY ID
const getBusById = async (id) => {
  return prisma.bus.findUnique({
    where: { id },
    include: { seats: true, bookings: true },
  });
};

// GET BUS SEATS
const getBusSeats = async (busId) => {
  return prisma.seat.findMany({
    where: { busId },
    orderBy: { seatNumber: "asc" },
  });
};

module.exports = {
  createBus,
  getAllBuses,
  getBusById,
  getBusSeats,
};