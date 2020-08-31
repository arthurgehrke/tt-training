require('dotenv').config()

const nodemailer = require('nodemailer')

const mail = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
})

async function mailService({ email, subject, text }) {
  await mail.sendMail({
    from: 'leandro@tt.training.com',
    to: email,
    subject,
    text
  })
}

module.exports = mailService
