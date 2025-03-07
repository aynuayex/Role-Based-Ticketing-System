const express = require("express");
const router = express.Router();

const { validateUser } = require("../../middleware/validateRequest");
const {
  registerController,
  loginController,
  refreshController,
  logoutController,
  verifyEmailController
} = require("./controllers/index");

router.post("/register", validateUser, registerController.handleNewUser);
router.post("/login", validateUser, loginController.handleLogin);
router.get("/logout", logoutController.handleLogout);
router.get("/refresh", refreshController.handleRefreshToken);

router.get("/send-otp/:userId", verifyEmailController.handleVerificationCodeSend)
router.post("/verify-email", verifyEmailController.handleEmailVerificationCode)

module.exports = router;
