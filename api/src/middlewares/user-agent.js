require('dotenv').config()
const process = require('process')
const Bowser = require('bowser')

const userAgentMiddleware = (req, res, next) => {
  const isRobot = /bot|crawler|spider|crawling/i.test(req.headers['user-agent'])
  req.isRobot = isRobot
  req.userLanguage = req.headers['accept-language'] ? (req.headers['accept-language'].split(',')[0]).split('-')[0] : process.env.DEFAULT_LANGUAGE
  req.userAgent = Bowser.parse(req.headers['user-agent'])

  next()
}

module.exports = userAgentMiddleware
