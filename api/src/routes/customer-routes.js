module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/customer/route-controller.js')
  const authCustomerJwt = require('../middlewares/auth-customer-jwt.js')

  router.post('/', [authCustomerJwt.verifyCustomerToken], controller.findAll)

  app.use('/api/customer/routes', router)
}
