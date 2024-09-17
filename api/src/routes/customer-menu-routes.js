module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/customer/menu-controller.js')
  const authCustomerJwt = require('../middlewares/auth-customer-jwt.js')

  router.get('/display/:name', [authCustomerJwt.verifyCustomerToken], controller.getMenuItems)

  app.use('/api/customer/menus', router)
}
