const express = require("express");
const router = express.Router();

const seatLockController = require("./seatLock.controller");

// you should use auth middleware here
router.post("/lock", seatLockController.lockSeat);

module.exports = router;