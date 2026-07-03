const express = require("express");
const router = express.Router();


const authController = require("./auth.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get(
    "/me",
    authMiddleware,
    authController.getProfile
);

router.patch(
  "/profile",
  authMiddleware,
  authController.updateProfile
);

router.patch(
  "/change-password",
  authMiddleware,
  authController.changePassword
);

router.post(
  "/forgot-password",
  authController.forgotPassword
);

router.post(
  "/reset-password",
  authController.resetPassword
);

module.exports = router;