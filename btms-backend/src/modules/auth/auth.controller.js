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