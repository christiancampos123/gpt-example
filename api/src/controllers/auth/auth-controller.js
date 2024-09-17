exports.activate = async (req, res) => {
  try {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/

    if (!req.body.token || !req.body.password) {
      return res.status(400).send({ message: 'Los campos no pueden estar vacios.' })
    }

    if (!regex.test(req.body.password)) {
      return res.status(400).send({ message: 'La contraseña no cumple con los requisitos mínimos.' })
    }

    const used = await req.authorizationService.useToken(req.body.token)

    if (!used) {
      return res.status(404).send({ message: 'Token no encontrado' })
    }

    await req.authorizationService.createCredentials(req.body.token, req.body.password)

    res.status(200).send({ message: 'Cuenta activada correctamente' })
  } catch (err) {
    res.status(500).send({ message: 'Algún error ha surgido al activar la cuenta. Pongasé en contacto con nosotros.' })
  }
}

exports.reset = async (req, res) => {
  try {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/

    if (!req.body.token || !req.body.password) {
      return res.status(400).send({ message: 'Los campos no pueden estar vacios.' })
    }

    if (!regex.test(req.body.password)) {
      return res.status(400).send({ message: 'La contraseña no cumple con los requisitos mínimos.' })
    }

    const used = await req.authorizationService.useResetPasswordToken(req.body.token)

    if (!used) {
      return res.status(404).send({ message: 'Token no encontrado' })
    }

    await req.authorizationService.resetCredentials(req.body.token, req.body.password)

    res.status(200).send({ message: 'Cuenta activada correctamente' })
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: 'Algún error ha surgido al activar la cuenta. Pongasé en contacto con nosotros.' })
  }
}
