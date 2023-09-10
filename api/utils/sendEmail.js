const nodemailer = require("nodemailer");
// require("dotenv").config({ path: "../config/.env" });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "adejumot77@gmail.com",
    pass: "fynhdkocqtqxjttc",
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
