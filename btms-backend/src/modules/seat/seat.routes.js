const express = require("express");
const router = express.Router();

const seatController = require("./seat.controller");
const auth = require("../../middleware/authMiddleware");
const authorize = require("../../middleware/authorize");

// TEST ROUTE
router.post("/generate", auth, authorize("ADMIN", "SUPER_ADMIN"), seatController.generateSeats);

// HOLD ROUTE
router.post("/hold", auth, seatController.holdSeats);

module.exports = router;