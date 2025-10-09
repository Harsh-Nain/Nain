const { randomInt } = require("crypto");
const nodemailer = require("nodemailer");

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
    text: `Your Backcrafter account OTP is ${otp}. It’s valid for 5 minutes.`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (err) {
    console.log(err.maasge);
  }
}
function generateOtp() {
  return String(randomInt(0, 1000000)).padStart(6, "0");
}

module.exports = { generateOtp, sendMail };
