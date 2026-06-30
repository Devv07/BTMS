// booking cancelled email template

const bookingCancelled = ({
  passengerName,
  ticketNumber,
  busName,
  busNumber,
  fromLocation,
  toLocation,
  departureTime,
  totalAmount,
}) => {
  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>Booking Cancelled</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
    <td align="center">

    <table width="650" cellpadding="0" cellspacing="0"
    style="background:#ffffff;border-radius:10px;overflow:hidden;">

    <tr>
    <td style="background:#dc3545;color:#fff;padding:30px;text-align:center;">
    <h1>❌ Booking Cancelled</h1>
    </td>
    </tr>

    <tr>
    <td style="padding:35px;">

    <h2>Hello ${passengerName},</h2>

    <p>
        Your booking has been cancelled successfully.
    </p>

    <hr>

    <table width="100%" cellpadding="8">

        <tr>
            <td><strong>Ticket Number</strong></td>
            <td>${ticketNumber}</td>
        </tr>

        <tr>
            <td><strong>Bus</strong></td>
            <td>${busName}</td>
        </tr>

        <tr>
            <td><strong>Bus Number</strong></td>
            <td>${busNumber}</td>
        </tr>

        <tr>
            <td><strong>Route</strong></td>
            <td>${fromLocation} → ${toLocation}</td>
        </tr>

        <tr>
            <td><strong>Departure</strong></td>
            <td>${departureTime}</td>
        </tr>

        <tr>
            <td><strong>Refund Amount</strong></td>
            <td>NPR ${totalAmount}</td>
        </tr>

    </table>

    <hr>

    <p>
    If you paid online, your refund will be processed according to our refund policy.
    </p>

    <p>
    Thank you for choosing BTMS.
    </p>

    </td>
</tr>

<tr>
    <td style="background:#f5f5f5;padding:20px;text-align:center;">
    We hope to serve you again ❤️
    </td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

module.exports = bookingCancelled;