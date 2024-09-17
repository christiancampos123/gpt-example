const path = require('path')
require('dotenv').config()
const ejs = require('ejs')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const process = require('process')
const sequelizeDb = require('../models/sequelize')
// const Email = sequelizeDb.Email
const SentEmail = sequelizeDb.SentEmail
const EmailError = sequelizeDb.EmailError

module.exports = class EmailService {
  constructor (type) {
    if (type === 'smtp') {
      this.email = process.env.EMAIL

      this.transport = nodemailer.createTransport({
        pool: true,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secureConnection: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        },
        tls: {
          ciphers: 'SSLv3'
        }
      })
    } else if (type === 'gmail') {
      this.email = process.env.GOOGLE_EMAIL

      this.transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.GOOGLE_EMAIL,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          accessToken: this.getAccessToken()
        }
      })
    }

    this.template = {
      activationUrl: { file: 'activation-url', subject: { es: 'Activación de cuenta', en: 'Account activation' } },
      orderDetails: { file: 'order-details', subject: { es: 'Detalles del pedido', en: 'Order details' } }
    }
  }

  getAccessToken () {
    const myOAuth2Client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    )

    myOAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    })

    const myAccessToken = myOAuth2Client.getAccessToken()

    return myAccessToken
  }

  sendEmail (user, userType, template, data, attachments = []) {
    try {
      if (!user.language) user.language = 'es'

      const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      data.apiUrl = process.env.API_URL
      data.uuid = uuid

      ejs.renderFile(path.join(__dirname, `../templates/emails/${user.language}/${this.template[template].file}.ejs`), { data }, (err, html) => {
        if (err) {
          EmailError.create(
            {
              userId: user.id,
              userType,
              emailTemplate: template,
              error: err.message
            }
          )

          return
        }

        const mailOptions = {
          from: this.email,
          to: user.email,
          subject: this.template[template].subject[user.language],
          html
        }

        if (attachments.length) {
          mailOptions.attachments = attachments
        }

        this.transport.sendMail(mailOptions, function (err, result) {
          if (err) {
            EmailError.create(
              {
                userId: user.id,
                userType,
                emailTemplate: template,
                error: err.message
              }
            )
          } else {
            SentEmail.create(
              {
                userId: user.id,
                userType,
                sendAt: new Date(),
                emailTemplate: template,
                readed: false,
                uuid
              }
            )
          }
        })
      })
    } catch (err) {
      console.log(err)
    }
  }

  emailReaded (uuid) {
    SentEmail.update(
      {
        readedAt: new Date()
      },
      {
        where: {
          uuid
        }
      }
    )
  }
}
