const prisma = require("../../config/prisma");
const { hashPassword, comparePassword } = require("../../utils/hash");
const { generateToken } = require("../../utils/jwt");

// REGISTER
const register = async (data) => {
  const exists = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (exists) throw new Error("User already exists");

  const hashed = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      password: hashed,
      role: "USER",
    },
  });

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user),
  };
};

// LOGIN
const login = async (data) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new Error("Invalid credentials");

  const ok = await comparePassword(data.password, user.password);

  if (!ok) throw new Error("Invalid credentials");

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user),
  };
};

module.exports = { register, login };