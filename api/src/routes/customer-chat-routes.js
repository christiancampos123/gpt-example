module.exports = (app) => {
  const router = require('express').Router()
  const authCustomerJwt = require('../middlewares/auth-customer-jwt.js')
  const controller = require('../controllers/customer/chat-controller.js')

  router.get('/', [authCustomerJwt.verifyCustomerToken], controller.findAll)
  router.get('/last', [authCustomerJwt.verifyCustomerToken], controller.findLast)

  app.use('/api/customer/chats', router)
}
