const express = require("express");
const router = express.Router();

const busController = require("./bus.controller");
const auth = require("../../middleware/authMiddleware");
const authorize = require("../../middleware/authorize");

/**
 * =========================
 * BUS ROUTES (PRODUCTION SAFE)
 * =========================
 */

// CREATE BUS (ADMIN / SUPER_ADMIN only)
router.post(
  "/",
  auth,
  authorize("ADMIN", "SUPER_ADMIN"),
  busController.createBus
);

// GET ALL BUSES (PUBLIC)
router.get("/", busController.getAllBuses);

// GET BUS SEATS (PUBLIC or AUTH optional)
router.get("/:id/seats", busController.getBusSeats);

// GET BUS BY ID (PUBLIC)
router.get("/:id", busController.getBusById);

module.exports = router;