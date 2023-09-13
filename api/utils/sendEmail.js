const nodemailer = require("nodemailer");
// require("dotenv").config({ path: "../config/.env" });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (options) => {
  // send mail with defined transport object

  const message = await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  });

  console.log("Message sent: %s", message.messageId);
};

module.exports = sendEmail;
