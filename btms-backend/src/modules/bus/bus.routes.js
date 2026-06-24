const express = require("express");
const router = express.Router();

const busController = require("./bus.controller");

const auth = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/role.middleware");

// CREATE BUS
router.post(
  "/",
  auth,
  authorize("ADMIN", "SUPER_ADMIN"),
  busController.createBus
);

// GET ALL BUSES
router.get("/", busController.getAllBuses);

// GET BUS BY ID
router.get("/:id", busController.getBusById);

module.exports = router;