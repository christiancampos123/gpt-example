module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/auth/auth-controller.js')

  router.post('/activate', controller.activate)
  router.post('/reset', controller.reset)

  app.use('/api/auth', router)
}
