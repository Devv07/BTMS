const prisma = require("../../config/prisma");
const { hashPassword, comparePassword } = require("../../utils/hash");
const { generateToken } = require("../../utils/jwt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const notificationService = require("../notification/notification.service");


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
  console.log("Login request:", data.email);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  console.log("Database user:", user);

  if (!user) {
    throw new Error("User not found");
  }

  // Check if account is active
  if (user.status === "INACTIVE") {
    throw new Error(
      "Your account has been deactivated. Please contact support."
    );
  }

  const ok = await comparePassword(data.password, user.password);

  console.log("Password match:", ok);

  if (!ok) {
    throw new Error("Wrong password");
  }

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    token: generateToken(user),
  };
};

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateProfile = async (userId, data) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      fullName: data.fullName,
      phone: data.phone,
      address: data.address,
      profileImage: data.profileImage,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      address: true,
      profileImage: true,
      role: true,
      updatedAt: true,
    },
  });
};

const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return true;
};


const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // Don't reveal whether the email exists
  if (!user) {
    return true;
  }

  const token = crypto.randomBytes(32).toString("hex");

  const expires = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    },
  });

  const resetLink =
    `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  await notificationService.sendPasswordReset({
    email: user.email,
    fullName: user.fullName,
    resetLink,
  });

  return true;
};

const resetPassword = async ({
  token,
  newPassword,
}) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  return true;
};



module.exports = { 
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};