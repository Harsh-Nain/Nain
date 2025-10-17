const nodemailer = require("nodemailer");
const { randomInt } = require("crypto");

function generateOtp() {
  return String(randomInt(0, 1000000)).padStart(6, "0");
}

async function sendMail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}. Its valid for 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
  console.log("OTP sent to:", email, `${otp}`);
  return true;
}

module.exports = { generateOtp, sendMail }