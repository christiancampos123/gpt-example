module.exports = (app) => {
  const auth = require('../controllers/auth/auth-user-controller.js')

  app.post('/api/auth/user/signin', auth.signin)
  app.post('/api/auth/user/reset', auth.reset)
  app.get('/api/auth/user/check-signin', auth.checkSignin)
}
