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
const reportRoutes = require("./modules/reports/report.route");
const reviewRoutes = require("./modules/reviews/review.route");
const couponRoutes = require("./modules/coupons/coupon.route");
const refundRoutes = require("./modules/refund/refund.route");
const dashboardRoutes = require("./modules/dashboard/dashboard.route");
const userRoutes = require("./modules/user/user.route");


const app = express();

// MIDDLEWARE
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/seat-locks", seatLockRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/dashboard", dashboardRoutes);


// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running 🚀",
  });
});

module.exports = app;