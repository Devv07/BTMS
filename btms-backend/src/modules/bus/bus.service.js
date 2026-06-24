const prisma = require("../../config/prisma");

const createBus = async (data) => {
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
    },
});
    return bus;
};

const getAllBuses = async () => {
return prisma.bus.findMany({
    orderBy: {
        createdAt: "desc",
        },
    });
};

module.exports = {
    createBus,
    getAllBuses,
};

const getBusById = async (id) => {
  return prisma.bus.findUnique({
    where: { id },
    include: { bookings: true },
  });
};

module.exports = {
  createBus,
  getAllBuses,
  getBusById,
};