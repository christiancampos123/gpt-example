require('dotenv').config()
const jwt = require('jsonwebtoken')
const process = require('process')

const verifyCustomerToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({
      redirection: '/login'
    })
  }

  const token = req.headers.authorization.split(' ')[1]

  if (token === 'null') {
    return res.status(401).send({
      redirection: '/login'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        redirection: '/login'
      })
    }

    if (decoded.type && decoded.type !== 'customerStaff') {
      return res.status(401).send({
        redirection: '/login'
      })
    }

    req.customerStaffId = decoded.customerStaffId
    req.customerId = decoded.customerId

    next()
  })
}

const authCustomerJwt = {
  verifyCustomerToken
}

module.exports = authCustomerJwt
