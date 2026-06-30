// import mail transporter
const transporter = require("../../../config/mail");

// verify email connection
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log("📧 Email server connected successfully");
  } catch (error) {
    console.error("❌ Email server connection failed");
    console.error(error.message);
  }
};

// send email
const sendEmail = async ({
  to,
  subject,
  html,
  text,
  attachments = [],
}) => {
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
    html,
    attachments,
  });
};

// export functions
module.exports = {
  sendEmail,
  verifyConnection,
};