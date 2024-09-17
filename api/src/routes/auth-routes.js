module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/auth/route-controller.js')

  router.post('/', controller.findAll)

  app.use('/api/auth/routes', router)
}
