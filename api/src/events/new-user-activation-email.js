const EmailService = require('../services/email-service')

exports.handleEvent = async (redisClient, subscriberClient) => {
  subscriberClient.subscribe('new-user-token', (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err)
    }
  })

  subscriberClient.on('message', async (channel, message) => {
    if (channel === 'new-user-token') {
      const emailService = new EmailService('gmail')
      const data = JSON.parse(message)

      emailService.sendEmail(data.user, 'user', 'activationUrl', data)
    }
  })
}
