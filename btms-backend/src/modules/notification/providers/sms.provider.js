// send sms

const sendSMS = async ({
  phone,
  message,
}) => {
  try {
    // Placeholder for future SMS integration
    // Examples:
    // - Twilio
    // - Vonage
    // - Sparrow SMS (Nepal)

    console.log("==================================");
    console.log("SMS Notification");
    console.log("To:", phone);
    console.log("Message:", message);
    console.log("==================================");

    return {
      success: true,
      message: "SMS sent successfully",
    };
  } catch (error) {
    console.error("SMS Error:", error.message);

    return {
      success: false,
      message: "Failed to send SMS",
    };
  }
};

module.exports = {
  sendSMS,
};