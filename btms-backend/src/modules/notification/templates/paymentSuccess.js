// payment success email template

const paymentSuccess = ({
  passengerName,
  ticketNumber,
  paymentMethod,
  transactionId,
  amount,
}) => {
  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>Payment Successful</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:10px;overflow:hidden;">

<tr>
<td style="background:#198754;color:#fff;padding:30px;text-align:center;">
<h1>✅ Payment Successful</h1>
</td>
</tr>

<tr>
<td style="padding:35px;">

<h2>Hello ${passengerName},</h2>

<p>
Your payment has been received successfully.
</p>

<hr>

<table width="100%" cellpadding="8">

<tr>
<td><strong>Ticket Number</strong></td>
<td>${ticketNumber}</td>
</tr>

<tr>
<td><strong>Payment Method</strong></td>
<td>${paymentMethod}</td>
</tr>

<tr>
<td><strong>Transaction ID</strong></td>
<td>${transactionId || "N/A"}</td>
</tr>

<tr>
<td><strong>Amount</strong></td>
<td>NPR ${amount}</td>
</tr>

<tr>
<td><strong>Status</strong></td>
<td style="color:green;"><strong>SUCCESS</strong></td>
</tr>

</table>

<hr>

<p>
Thank you for using <strong>BTMS</strong>.
</p>

</td>
</tr>

<tr>
<td style="background:#f5f5f5;padding:20px;text-align:center;">
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

module.exports = paymentSuccess;