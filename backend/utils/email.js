const nodemailer = require('nodemailer')
require('dotenv').config();

const sendEmail = async (options) => {
  console.log(process.env.APP_PASS);

  const transporter = nodemailer.createTransport({
    
    service: 'Gmail',
    tls: {
      rejectUnauthorized: false
    },
    secure:false,
    port:25,
    auth: {
      user:  process.env.EMAIL_USER, 
      pass: process.env.APP_PASS ,
    }
  })

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  }
  await transporter.sendMail(message)
}

module.exports = sendEmail