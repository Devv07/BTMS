// ========================================
// BOOKING CONFIRMATION EMAIL TEMPLATE
// ========================================

const bookingConfirmed = ({
  passengerName,
  ticketNumber,
  busName,
  busNumber,
  fromLocation,
  toLocation,
  departureTime,
  arrivalTime,
  seatNumbers,
  totalAmount,
}) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Booking Confirmed</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f5f5f5;
    font-family:Arial, Helvetica, sans-serif;
  "
>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="padding:40px 0;"
  >
    <tr>
      <td align="center">

        <table
          width="650"
          cellpadding="0"
          cellspacing="0"
          style="
            background:#ffffff;
            border-radius:10px;
            overflow:hidden;
            box-shadow:0 5px 15px rgba(0,0,0,.08);
          "
        >

          <!-- Header -->
          <tr>
            <td
              style="
                background:#0d6efd;
                color:#ffffff;
                padding:30px;
                text-align:center;
              "
            >
              <h1 style="margin:0;">🚌 BTMS</h1>

              <p
                style="
                  margin-top:10px;
                  font-size:18px;
                "
              >
                Booking Confirmed
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:35px;">

              <h2 style="margin-top:0;">
                Hello ${passengerName},
              </h2>

              <p>
                Your bus ticket has been
                <strong>successfully booked.</strong>
                Thank you for choosing BTMS.
              </p>

              <hr />

              <h3>Ticket Details</h3>

              <table
                width="100%"
                cellpadding="8"
                cellspacing="0"
              >

                <tr>
                  <td><strong>Ticket Number</strong></td>
                  <td>${ticketNumber}</td>
                </tr>

                <tr>
                  <td><strong>Passenger</strong></td>
                  <td>${passengerName}</td>
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
                  <td><strong>Arrival</strong></td>
                  <td>${arrivalTime}</td>
                </tr>

                <tr>
                  <td><strong>Seat Numbers</strong></td>
                  <td>${seatNumbers.join(", ")}</td>
                </tr>

                <tr>
                  <td><strong>Total Amount</strong></td>
                  <td>NPR ${totalAmount}</td>
                </tr>

              </table>

              <hr />

              <p>
                Please arrive at the boarding point at least
                <strong>30 minutes</strong>
                before departure.
              </p>

              <p>
                Keep your ticket and QR code ready while boarding.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="
                background:#f8f9fa;
                padding:20px;
                text-align:center;
                color:#666666;
                font-size:13px;
              "
            >

              <p style="margin:0;">
                Thank you for choosing
                <strong>BTMS</strong>
              </p>

              <p style="margin-top:8px;">
                Safe Journey ❤️
              </p>

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

module.exports = bookingConfirmed;