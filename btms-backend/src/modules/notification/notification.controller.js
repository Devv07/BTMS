const asyncHandler = require("express-async-handler");
const notificationService = require("./notification.service");

// ========================================
// SEND EMAIL
// ========================================

exports.sendEmail = asyncHandler(async (req, res) => {
  await notificationService.sendWelcomeEmail(req.body);

  res.json({
    success: true,
    message: "Email sent successfully",
  });
});

// ========================================
// SEND SMS
// ========================================

exports.sendSMS = asyncHandler(async (req, res) => {
  const { phone, message } = req.body;

  await notificationService.sendSMSNotification(phone, message);

  res.json({
    success: true,
    message: "SMS sent successfully",
  });
});

// ========================================
// SEND PUSH
// ========================================

exports.sendPush = asyncHandler(async (req, res) => {
  await notificationService.sendPushNotification(req.body);

  res.json({
    success: true,
    message: "Push notification sent successfully",
  });
});