module.exports = (app) => {
  const router = require('express').Router()
  const authCookie = require('../middlewares/auth-cookie.js')
  const uploadFiles = require('../middlewares/upload-files.js')
  const controller = require('../controllers/admin/image-controller.js')

  router.get('/image/:filename', [authCookie.verifyUserCookie], controller.getImage)
  router.post('/', [authCookie.verifyUserCookie, uploadFiles], controller.create)
  router.get('/', [authCookie.verifyUserCookie], controller.findAll)
  router.get('/:filename', [authCookie.verifyUserCookie], controller.findOne)
  router.delete('/:filename', [authCookie.verifyUserCookie], controller.delete)

  app.use('/api/admin/images', router)
}
