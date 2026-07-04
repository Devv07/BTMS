const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const authorize = require("../../middleware/authorize");

const userController = require("./user.controller");

// get all users
router.get(
  "/",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  userController.getAllUsers
);

// get user by id
router.get(
  "/:id",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  userController.getUserById
);

// update user
router.patch(
  "/:id",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  userController.updateUser
);

// update user status
router.patch(
  "/:id/status",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  userController.updateUserStatus
);

// delete user
router.delete(
  "/:id",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  userController.deleteUser
);

module.exports = router;