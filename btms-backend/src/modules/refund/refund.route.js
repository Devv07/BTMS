const express = require("express");

const router = express.Router();

const refundController = require("./refund.controller");

const authMiddleware = require("../../middleware/authMiddleware");
const authorize = require("../../middleware/authorize");

// request refund
router.post(
  "/",
  authMiddleware,
  refundController.requestRefund
);

// all refunds
router.get(
  "/",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  refundController.getRefunds
);

// refund by id
router.get(
  "/:id",
  authMiddleware,
  refundController.getRefund
);

// my refund history
router.get(
  "/my/history",
  authMiddleware,
  refundController.getMyRefunds
);

// refund history by user
router.get(
  "/user/:userId",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  refundController.getRefundsByUser
);

// update refund status
router.patch(
  "/:id/status",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  refundController.updateRefundStatus
);

router.get(
  "/analytics",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  refundController.getRefundAnalytics
);

module.exports = router;