const express = require("express");

const router = express.Router();

const paymentController = require("./payment.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

router.post(
  "/",
  authMiddleware,
  paymentController.createPayment
);

router.post(
  "/verify",
  authMiddleware,
  paymentController.verifyPayment
);

router.post(
  "/refund",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  paymentController.refundPayment
);

router.get(
  "/esewa/success",
  paymentController.esewaSuccess
);

router.get(
  "/esewa/failure",
  paymentController.esewaFailure
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  paymentController.getPayments
);

router.get(
  "/:id",
  authMiddleware,
  paymentController.getPayment
);

module.exports = router;