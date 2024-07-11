const nodemailer = require('nodemailer');

const sendMail = async (options) => {
  // 1) Create a Transpoter

  const transpoter = nodemailer.createTransport({
    service: 'Gmail',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // 2) Define the email option

  const mailOption = {
    from: process.env.EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3) Send the email
  await transpoter.sendMail(mailOption);
};

module.exports = sendMail;
