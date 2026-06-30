// welcome email template

const welcome = ({
  fullName,
}) => {
  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>Welcome to BTMS</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 5px 15px rgba(0,0,0,.08);">

<tr>
<td style="background:#0d6efd;color:#ffffff;padding:30px;text-align:center;">
<h1 style="margin:0;">🚌 Welcome to BTMS</h1>
</td>
</tr>

<tr>
<td style="padding:35px;">

<h2>Hello ${fullName},</h2>

<p>
Welcome to the Bus Ticket Management System.
</p>

<p>
Your account has been created successfully.
</p>

<hr>

<h3>With BTMS you can:</h3>

<ul>
<li>Book bus tickets online</li>
<li>Select your preferred seats</li>
<li>Pay securely</li>
<li>Download PDF tickets</li>
<li>Receive email notifications</li>
<li>Track your bookings</li>
</ul>

<hr>

<p>
Thank you for choosing BTMS.
</p>

</td>
</tr>

<tr>
<td style="background:#f8f9fa;padding:20px;text-align:center;">
Have a Safe Journey ❤️
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

module.exports = welcome;