module.exports = (app) => {
  const auth = require('../controllers/auth/auth-customer-controller.js')
  const authCustomerJwt = require('../middlewares/auth-customer-jwt.js')

  app.post('/api/auth/customer/signin', auth.signin)
  app.post('/api/auth/customer/reset', auth.reset)
  app.get('/api/auth/customer/check-signin', [authCustomerJwt.verifyCustomerToken], auth.checkSignin)
}
