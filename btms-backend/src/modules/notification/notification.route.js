const express = require("express");

const router = express.Router();

const controller = require("./notification.controller");

const auth = require("../../middleware/auth.middleware");
const role = require("../../middleware/role.middleware");

// ========================================
// SEND EMAIL
// ========================================

router.post(
  "/email",
  auth,
  role("ADMIN", "SUPER_ADMIN"),
  controller.sendEmail
);

// ========================================
// SEND SMS
// ========================================

router.post(
  "/sms",
  auth,
  role("ADMIN", "SUPER_ADMIN"),
  controller.sendSMS
);

// ========================================
// SEND PUSH
// ========================================

router.post(
  "/push",
  auth,
  role("ADMIN", "SUPER_ADMIN"),
  controller.sendPush
);

module.exports = router;