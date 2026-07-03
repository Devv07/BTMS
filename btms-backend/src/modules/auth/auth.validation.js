const { z } = require("zod");

// ============================
// Register
// ============================

const registerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),

  email: z.string().email("Invalid email"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ============================
// Login
// ============================

const loginSchema = z.object({
  email: z.string().email("Invalid email"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ============================
// Update Profile
// ============================

const updateProfileSchema = z.object({
  fullName: z.string().min(3).max(100).optional(),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone must be exactly 10 digits")
    .optional(),

  address: z.string().optional(),

  profileImage: z.string().url().optional(),
});

// ============================
// Change Password
// ============================

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),

  newPassword: z.string().min(6),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

const resetPasswordSchema = z.object({
  token: z.string({
    required_error: "Reset token is required",
  }),

  newPassword: z
    .string({
      required_error: "New password is required",
    })
    .min(6, "Password must be at least 6 characters"),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};