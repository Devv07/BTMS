const { sendEmail } = require("./providers/email.provider");
const { sendSMS } = require("./providers/sms.provider");
const { sendPush } = require("./providers/push.provider");

const bookingConfirmed = require("./templates/bookingConfirmed");
const bookingCancelled = require("./templates/bookingCancelled");
const paymentSuccess = require("./templates/paymentSuccess");
const paymentFailed = require("./templates/paymentFailed");
const refundSuccess = require("./templates/refundSuccess");
const welcome = require("./templates/welcome");
const passwordReset = require("./templates/passwordReset");

// ========================================
// BOOKING CONFIRMATION
// ========================================

const sendBookingConfirmation = async (data) => {
  const html = bookingConfirmed(data);

  return sendEmail({
    to: data.email,
    subject: "Booking Confirmed",
    html,
    attachments: data.pdfBuffer
      ? [
          {
            filename: "ticket.pdf",
            content: data.pdfBuffer,
          },
        ]
      : [],
  });
};

// ========================================
// BOOKING CANCELLED
// ========================================

const sendBookingCancellation = async (data) => {
  const html = bookingCancelled(data);

  return sendEmail({
    to: data.email,
    subject: "Booking Cancelled",
    html,
  });
};

// ========================================
// PAYMENT SUCCESS
// ========================================

const sendPaymentSuccess = async (data) => {
  const html = paymentSuccess(data);

  return sendEmail({
    to: data.email,
    subject: "Payment Successful",
    html,
  });
};

// ========================================
// PAYMENT FAILED
// ========================================

const sendPaymentFailed = async (data) => {
  const html = paymentFailed(data);

  return sendEmail({
    to: data.email,
    subject: "Payment Failed",
    html,
  });
};

// ========================================
// REFUND SUCCESS
// ========================================

const sendRefundSuccess = async (data) => {
  const html = refundSuccess(data);

  return sendEmail({
    to: data.email,
    subject: "Refund Successful",
    html,
  });
};

// ========================================
// WELCOME EMAIL
// ========================================

const sendWelcomeEmail = async (data) => {
  const html = welcome(data);

  return sendEmail({
    to: data.email,
    subject: "Welcome to BTMS",
    html,
  });
};

// ========================================
// PASSWORD RESET
// ========================================

const sendPasswordReset = async (data) => {
  const html = passwordReset(data);

  return sendEmail({
    to: data.email,
    subject: "Reset Your Password",
    html,
  });
};

// ========================================
// SMS
// ========================================

const sendSMSNotification = async (phone, message) => {
  return sendSMS({
    phone,
    message,
  });
};

// ========================================
// PUSH NOTIFICATION
// ========================================

const sendPushNotification = async ({
  deviceToken,
  title,
  body,
  data = {},
}) => {
  return sendPush({
    deviceToken,
    title,
    body,
    data,
  });
};

const sendRefundApproved = async (refund) => {
  return sendEmail({
    to: refund.booking.user.email,
    subject: "Refund Approved",
    html: `
      <h2>Refund Approved</h2>

      <p>Hello ${refund.booking.user.fullName},</p>

      <p>Your refund request has been approved.</p>

      <p><strong>Refund Amount:</strong> Rs. ${refund.amount}</p>

      <p><strong>Booking:</strong> ${refund.booking.ticketNumber}</p>

      <p><strong>Remark:</strong> ${
        refund.adminRemark || "N/A"
      }</p>

      <br>

      <p>Thank you.</p>
    `,
  });
};

const sendRefundRejected = async (refund) => {
  return sendEmail({
    to: refund.booking.user.email,
    subject: "Refund Rejected",
    html: `
      <h2>Refund Rejected</h2>

      <p>Hello ${refund.booking.user.fullName},</p>

      <p>Your refund request has been rejected.</p>

      <p><strong>Remark:</strong> ${
        refund.adminRemark || "N/A"
      }</p>

      <br>

      <p>If you believe this is incorrect, please contact support.</p>
    `,
  });
};

module.exports = {
  sendBookingConfirmation,
  sendBookingCancellation,
  sendPaymentSuccess,
  sendPaymentFailed,
  sendRefundSuccess,
  sendWelcomeEmail,
  sendPasswordReset,
  sendSMSNotification,
  sendPushNotification,
  sendRefundApproved,
  sendRefundRejected,
};