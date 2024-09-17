module.exports = (app) => {
  const router = require('express').Router()
  const authCustomerJwt = require('../middlewares/auth-customer-jwt.js')
  const controller = require('../controllers/customer/assistant-controller.js')

  router.get('/', [authCustomerJwt.verifyCustomerToken], controller.findAll)
  router.post('/response', [authCustomerJwt.verifyCustomerToken], controller.assistantResponse)


  app.use('/api/customer/assistants', router)
}
