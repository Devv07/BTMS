// payment failed email template

const paymentFailed = ({
  passengerName,
  ticketNumber,
  paymentMethod,
  amount,
}) => {
  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>Payment Failed</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:10px;overflow:hidden;">

<tr>
<td style="background:#dc3545;color:#fff;padding:30px;text-align:center;">
<h1>❌ Payment Failed</h1>
</td>
</tr>

<tr>
<td style="padding:35px;">

<h2>Hello ${passengerName},</h2>

<p>
Unfortunately, your payment could not be completed.
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
<td><strong>Amount</strong></td>
<td>NPR ${amount}</td>
</tr>

<tr>
<td><strong>Status</strong></td>
<td style="color:red;"><strong>FAILED</strong></td>
</tr>

</table>

<hr>

<p>
Please try again or choose another payment method.
</p>

<p>
If the amount was deducted from your account, it will usually be reversed according to your payment provider's policy.
</p>

</td>
</tr>

<tr>
<td style="background:#f5f5f5;padding:20px;text-align:center;">
Thank you for choosing BTMS
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

module.exports = paymentFailed;