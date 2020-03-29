const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
exports.sendUserEmail = async (senderMail, subjectContent, message) => {
  const msg = {
    to: senderMail,
    from: process.env.MAIL_FROM,
    subject: subjectContent,
    text: message,
    html: message
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }
};
