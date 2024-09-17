const AuthorizationService = require('../services/authorization-service')

exports.handleEvent = async (redisClient, subscriberClient) => {
  subscriberClient.subscribe('new-customer-staff-credentials', (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err)
    }
  })

  subscriberClient.on('message', async (channel, message) => {
    if (channel === 'new-customer-staff-credentials') {
      const customerStaff = JSON.parse(message)
      const authorizationService = new AuthorizationService()
      const activationUrl = await authorizationService.createActivationToken(customerStaff.id, 'customerStaff')

      redisClient.publish('new-customer-staff-token', JSON.stringify({
        activationUrl,
        customerStaff
      }))
    }
  })
}
