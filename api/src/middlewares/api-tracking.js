const apiTrackingMiddleware = (req, res, next) => {
  req.startTime = Date.now()

  res.on('finish', function () {
    const log = {
      resource: req.originalUrl,
      resourceElement: req.params?.id ?? null,
      method: req.method,
      httpCode: res.statusCode,
      message: null,
      fingerprint: req.body.data?.fingerprint ?? req.cookies.fingerprint ?? null,
      userId: req.userId,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      isRobot: req.isRobot,
      startTime: req.startTime,
      endTime: Date.now(),
      latencyMS: Date.now() - req.startTime
    }

    const originalSend = res.send

    res.send = function (body) {
      if (res.statusCode >= 400) {
        log.message = body
      }

      return originalSend.apply(res, arguments)
    }

    req.trackingService.createApiLog(log)
  })

  next()
}

module.exports = apiTrackingMiddleware
