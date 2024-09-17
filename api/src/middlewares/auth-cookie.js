const verifyUserCookie = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.status(401).send({
      redirection: '/admin/login'
    })
  }
}

const authCookie = {
  verifyUserCookie
}

module.exports = authCookie
