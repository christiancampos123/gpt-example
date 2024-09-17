module.exports = (app) => {
  const router = require('express').Router()
  const authCookie = require('../middlewares/auth-cookie.js')
  const controller = require('../controllers/admin/route-controller.js')

  router.post('/', [authCookie.verifyUserCookie], controller.findAll)

  app.use('/api/admin/routes', router)
}
