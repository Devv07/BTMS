// password reset email template

const passwordReset = ({
  fullName,
  resetLink,
}) => {
  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>Password Reset</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 5px 15px rgba(0,0,0,.08);">

<tr>
<td style="background:#fd7e14;color:#ffffff;padding:30px;text-align:center;">
<h1 style="margin:0;">🔒 Password Reset</h1>
</td>
</tr>

<tr>
<td style="padding:35px;">

<h2>Hello ${fullName},</h2>

<p>
We received a request to reset your password.
</p>

<p>
Click the button below to reset your password.
</p>

<p style="text-align:center;margin:35px 0;">
<a href="${resetLink}"
style="background:#0d6efd;color:#ffffff;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:bold;">
Reset Password
</a>
</p>

<p>
This link will expire in <strong>15 minutes</strong>.
</p>

<p>
If you did not request a password reset, please ignore this email.
</p>

</td>
</tr>

<tr>
<td style="background:#f8f9fa;padding:20px;text-align:center;">
BTMS Security Team
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

module.exports = passwordReset;