require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const process = require('process')
const sequelizeDb = require('../../models/sequelize')
const CustomerStaff = sequelizeDb.CustomerStaff
const CustomerStaffCredential = sequelizeDb.CustomerStaffCredential

exports.signin = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: 'Los campos no pueden estar vacios.' })
    }

    if (!/^\S+@\S+\.\S+$/.test(req.body.email)) {
      return res.status(400).send({ message: 'La dirección de correo electrónico no es válida.' })
    }

    const customerStaffCredential = await CustomerStaffCredential.findOne({
      where: {
        email: req.body.email,
        deletedAt: null
      }
    })

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      customerStaffCredential.password
    )

    if (!passwordIsValid) {
      return res.status(404).send({
        message: 'Usuario o contraseña incorrecta'
      })
    }

    const customerStaff = await CustomerStaff.findByPk(customerStaffCredential.customerStaffId)

    const token = jwt.sign({ customerStaffId: customerStaffCredential.customerStaffId, customerId: customerStaff.customerId, type: 'customerStaff' }, process.env.JWT_SECRET, {
      expiresIn: 86400
    })

    res.status(200).send({
      customerAccessToken: token,
      redirection: '/'
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: err.message || 'Algún error ha surgido al recuperar los datos.' })
  }
}

exports.checkSignin = (req, res) => {
  res.status(200).send({
    redirection: '/cliente'
  })
}

exports.reset = async (req, res) => {
  CustomerStaffCredential.findOne({
    where: {
      email: req.body.email,
      deletedAt: null
    }
  }).then(async data => {
    if (!data) {
      return res.status(404).send({ message: 'Usuario no encontrado' })
    }

    await req.authorizationService.createResetPasswordToken(data.id, 'customerStaff')

    res.status(200).send({ message: 'Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña.' })
  }).catch(err => {
    console.log(err)
    res.status(500).send({ message: err.message || 'Algún error ha surgido al recuperar los datos.' })
  })
}
