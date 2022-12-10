const nodemailer = require("nodemailer");
const { signJWT } = require("./jwt.utils");
require("dotenv/config");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: `gmail`,
      port: 587,
      secure: true,
      auth: {
        user: `dessiebahiru79@gmail.com`,
        pass: `iiuizhkfqsedokrx`,
      },
    });

    await transporter.sendMail({
      from: `${process.env.USER}`,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

async function sendMail(email, role, name, sessionId) {
  const token = signJWT(
    {
      email,
      name,
      role,
      verified: false,
      sessionId,
    },
    "10m"
  );

  const message = `${process.env.BASE_URL}/api/verify/${email}/${token}`;
  await sendEmail(email, "Verify Email", message);
}

module.exports = { sendEmail, sendMail };
