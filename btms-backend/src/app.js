const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./modules/auth/auth.routes");
const busRoutes = require("./modules/bus/bus.routes");
const bookingRoutes = require("./modules/booking/booking.routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// PUBLIC AUTH ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/buses", busRoutes);
app.use("/api/v1/bookings", bookingRoutes);


// TEST ROUTE
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API Running",
    });
});

module.exports = app;