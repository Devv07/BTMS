// refund success email template

const refundSuccess = ({
  passengerName,
  ticketNumber,
  refundAmount,
  paymentMethod,
  refundDate,
}) => {
  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>Refund Successful</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 5px 15px rgba(0,0,0,.08);">

<tr>
<td style="background:#198754;color:#ffffff;padding:30px;text-align:center;">
<h1 style="margin:0;">💰 Refund Successful</h1>
</td>
</tr>

<tr>
<td style="padding:35px;">

<h2>Hello ${passengerName},</h2>

<p>
Your refund has been processed successfully.
</p>

<hr>

<table width="100%" cellpadding="8">

<tr>
<td><strong>Ticket Number</strong></td>
<td>${ticketNumber}</td>
</tr>

<tr>
<td><strong>Refund Amount</strong></td>
<td>NPR ${refundAmount}</td>
</tr>

<tr>
<td><strong>Payment Method</strong></td>
<td>${paymentMethod}</td>
</tr>

<tr>
<td><strong>Refund Date</strong></td>
<td>${refundDate}</td>
</tr>

</table>

<hr>

<p>
The refunded amount may take some time to appear in your account depending on your payment provider.
</p>

<p>
Thank you for choosing BTMS.
</p>

</td>
</tr>

<tr>
<td style="background:#f8f9fa;padding:20px;text-align:center;">
Safe Journey ❤️
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

module.exports = refundSuccess;