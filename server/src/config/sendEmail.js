const nodemailer = require("nodemailer");

const logger = require("./logger");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASS
  },
});

const sendEmail = async (email, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"TMS Support" <${process.env.USER}>`,
      to: email,
      subject,
      html: htmlContent,
    });

    logger.info("email sent successfully");
  } catch (error) {
    logger.error(`${error.message}, email not sent`);
  }
};

module.exports = sendEmail;
