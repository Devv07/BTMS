const asyncHandler = require("express-async-handler");
const authService = require("./auth.service");
const { registerSchema, loginSchema } = require("./auth.validation");

exports.register = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);

  const result = await authService.register(data);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);

  const result = await authService.login(data);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);

  res.json({
    success: true,
    data: user,
  });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(
    req.user.id,
    req.body
  );

  res.json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await authService.changePassword(
    req.user.id,
    currentPassword,
    newPassword
  );

  res.json({
    success: true,
    message: "Password changed successfully",
  });
});


exports.forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);

  res.json({
    success: true,
    message:
      "If the email exists, a password reset link has been sent.",
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);

  res.json({
    success: true,
    message: "Password reset successfully",
  });
});