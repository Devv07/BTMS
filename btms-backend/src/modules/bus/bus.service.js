const prisma = require("../../config/prisma");
const generateSeats = require("./seatGenereator");

// create bus
const createBus = async (data)=>{
  return await prisma.$transaction(async(tx)=>{
    const generatedSeats = generateSeats({
      template: data.seatTemplate,
      totalSeats : data.totalSeats,
    });

    // save bus
    const bus = await tx.bus.create({
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

      operatorName: data.operatorName || null,
      amenities: data.amenities || [],

      seatTemplate: data.seatTemplate,

      seatConfig: {
        template: data.seatTemplate,
      },

      seatLayout: generatedSeats,

      status: "ACTIVE",
    },
  });

    const seats = generatedSeats.map((seat)=>({
      busId: bus.id,
      seatNumber: seat.seatNumber,
      row:seat.row,
      col: seat.col,
      type: seat.type,
      status:seat.status,
      isHeld:false,
    })
    );

    await tx.seat.createMany({
      data:seats,
    });
    return bus;
  });
}

// get all buses
const getAllBuses =async()=>{
  return prisma.bus.findMany({
    orderBy:{
      createdAt:"desc",
    }
  });
};

// get bus by id
const getBusById = async(id)=>{
  return prisma.bus.findUnique({
    where:{id},
    include:{
      seats:{
        orderBy:[
        {
          row:"asc",
        },
        {
          col:"asc"
        },
      ],
      },
    },
  });
};

// get bus seats
const getBusSeats =async(busId)=>{
  return prisma.seat.findMany({
    where:{
      busId,
    },
    orderBy:[
      {
        row:"asc",
      },
      {
        col:"asc"
      }
    ]
  });
};

module.exports={
  createBus,
  getAllBuses,
  getBusById,
  getBusSeats
}