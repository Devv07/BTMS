const{z} = require('zod');

const createBusSchema = z.object({
    busName : z.string().min(1, { message: "Bus name is required" }),
    busNumber : z.string().min(1, { message: "Bus number is required" }),
    fromLocation : z.string().min(1, { message: "From location is required" }),
    toLocation : z.string().min(1, { message: "To location is required" }),
    departureTime : z.string().min(1, { message: "Departure time is required" }),
    arrivalTime : z.string().min(1, { message: "Arrival time is required" }),
    totalSeats : z.number({ invalid_type_error: "Total seats must be a number" }).int({ message: "Total seats must be an integer" }).positive({ message: "Total seats must be a positive number" }),
    price : z.number({ invalid_type_error: "Price must be a number" }).positive({ message: "Price must be a positive number" }),
});

module.exports = {
    createBusSchema,
};