const registerController = require("./registerController");
const loginController = require("./loginController");
const refreshController = require("./refreshTokenController");
const logoutController = require("./logoutController");
const verifyEmailController = require("./verifyEmailController");

module.exports = {
  registerController,
  loginController,
  refreshController,
  logoutController,
  verifyEmailController
};
