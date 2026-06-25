const express = require("express");
const router = express.Router();

const seatController = require("./seat.controller");
const auth = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/role.middleware");

// TEST ROUTE
router.post("/generate", auth, authorize("ADMIN", "SUPER_ADMIN"), seatController.generateSeats);

// HOLD ROUTE
router.post("/hold", auth, seatController.holdSeats);

module.exports = router;