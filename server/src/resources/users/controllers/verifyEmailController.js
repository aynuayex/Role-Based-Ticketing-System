const crypto = require("crypto");

const sendEmail = require("../../../config/sendEmail");
const { Token, User } = require("../model");
const logger = require("../../../config/logger");

const handleVerificationCodeSend = async (req, res) => {
  try {
    logger.info("User Email verification code request received");
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    // delete first if there is an otp sent that hasn't expired yet
    const sendOtp = await Token.find({ userId: user._id });
    if (sendOtp) {
      await Token.deleteMany({ userId: user._id });
    }
    const token = await Token.create({
      userId: user.id,
      token: crypto.randomBytes(3).toString("hex"),
    });
  
    const emailMessage = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
    <h2 style="color: #333; text-align: center;">🔐 Email Verification</h2>
    <p style="font-size: 16px; color: #555;">
      <strong>⚠️ Do not share this OTP with anyone!</strong>
    </p>
    <p style="font-size: 16px; color: #333; text-align: center; font-weight: bold;">
      Here is your verification code:
    </p>
    <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 20px; font-weight: bold; border-radius: 5px;">
      ${token.token}
    </div>
    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 10px;">
      This code will expire in <strong>10 minutes</strong>.
    </p>
    <p style="font-size: 14px; color: #777; text-align: center;">
      If you didn’t request this, you can safely ignore this email.
    </p>
  </div>`;

    await sendEmail(user.email, "Email Verification Code", emailMessage);

    res.status(200).end();
  } catch (err) {
    console.log({ err });
    logger.error(`Error sending OTP: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

const handleEmailVerificationCode = async (req, res) => {
  try {
    logger.info("User Email verification code verify request received");

    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    const sendOtp = await Token.findOne({ userId: user._id });
    if (!sendOtp) {
      return res
        .status(401)
        .json({ message: "OTP expired, please request a new one" });
    }

    if (sendOtp.token !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    await User.findByIdAndUpdate(user._id, { emailVerified: true });
    await Token.deleteMany({ userId: user._id });

    return res.status(200).end();
  } catch (err) {
    logger.error(`Error verifying OTP: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleVerificationCodeSend, handleEmailVerificationCode };
