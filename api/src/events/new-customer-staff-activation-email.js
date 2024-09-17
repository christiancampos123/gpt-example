const EmailService = require('../services/email-service')
const sequelizeDb = require('../models/sequelize')
const CustomerStaff = sequelizeDb.CustomerStaff

exports.handleEvent = async (redisClient, subscriberClient) => {
  subscriberClient.subscribe('new-customer-staff-token', (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err)
    }
  })

  subscriberClient.on('message', async (channel, message) => {
    if (channel === 'new-customer-staff-token') {
      const emailService = new EmailService('gmail')
      const data = JSON.parse(message)
      const customerStaff = await CustomerStaff.findByPk(data.customerStaff.id)

      emailService.sendEmail(customerStaff, 'customerStaff', 'activationUrl', data)
    }
  })
}
