const { z } = require("zod");

// update user
const updateUserSchema = z.object({
  fullName: z.string().min(3).max(100).optional(),

  email: z.string().email().optional(),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .optional(),

  address: z.string().max(255).optional(),

  profileImage: z.string().url().optional(),

  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]).optional(),
});

// update user status
const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

module.exports = {
  updateUserSchema,
  updateUserStatusSchema,
};