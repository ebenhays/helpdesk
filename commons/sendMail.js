const nodemailer = require("nodemailer");
exports.sendUserEmail = async ({ senderMail, subjectContent, message }) => {
  let fromMail = process.env.MAIL_FROM;
  let content = message;

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVICE,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_FROM,
      password: process.env.MAIL_PWD
    }
  });

  let mailOptions = {
    from: fromMail,
    to: senderMail,
    subject: subjectContent,
    text: content
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
