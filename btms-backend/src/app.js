const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./modules/auth/auth.routes");
const busRoutes = require("./modules/bus/bus.routes");
const bookingRoutes = require("./modules/booking/booking.routes");
const seatRoutes = require("./modules/seat/seat.routes");
const seatLockRoutes = require("./modules/seatLock/seatLock.route");
const paymentRoutes = require("./modules/payment/payment.route");
const startSeatLockCleaner = require("./jobs/seatLockerJob");
const notificationRoutes = require("./modules/notification/notification.route");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/buses", busRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/seats", seatRoutes);
app.use("/api/v1/seat-locks", seatLockRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running 🚀",
  });
});

module.exports = app;