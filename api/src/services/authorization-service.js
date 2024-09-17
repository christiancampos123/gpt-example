const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const sequelizeDb = require('../models/sequelize')

const entities = {
  user: {
    model: sequelizeDb.User,
    tokenModel: sequelizeDb.UserActivationToken,
    resetPasswordTokenModel: sequelizeDb.UserResetPasswordToken,
    credentialModel: sequelizeDb.UserCredential
  },
  customerStaff: {
    model: sequelizeDb.CustomerStaff,
    tokenModel: sequelizeDb.CustomerStaffActivationToken,
    resetPasswordTokenModel: sequelizeDb.CustomerStaffResetPasswordToken,
    credentialModel: sequelizeDb.CustomerStaffCredential
  }
}

module.exports = class AuthorizationService {
  createActivationToken = async (id, type) => {
    const entity = entities[type]
    if (!entity) throw new Error('Invalid type provided')

    const token = jwt.sign({ id, type }, process.env.JWT_SECRET)
    const expirationDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)

    await entity.tokenModel.create({
      [`${type}Id`]: id,
      token,
      expirationDate,
      used: false
    })

    const url = `${process.env.API_URL}/cuenta/activacion?token=${token}`

    return url
  }

  useToken = async (token) => {
    const { type } = jwt.verify(token, process.env.JWT_SECRET)
    const entity = entities[type]
    if (!entity) return false

    const activationToken = await entity.tokenModel.findOne({
      where: {
        token,
        used: false,
        expirationDate: {
          [sequelizeDb.Sequelize.Op.gt]: new Date()
        }
      }
    })

    if (!activationToken) return false

    activationToken.used = true
    await activationToken.save()

    return true
  }

  createResetPasswordToken = async (id, type) => {
    const entity = entities[type]
    if (!entity) throw new Error('Invalid type provided')

    const token = jwt.sign({ id, type }, process.env.JWT_SECRET)
    const expirationDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)

    await entity.resetPasswordTokenModel.create({
      [`${type}Id`]: id,
      token,
      expirationDate,
      used: false
    })

    const url = `${process.env.API_URL}/cuenta/reset?token=${token}`
    console.log(url)
    return url
  }

  useResetPasswordToken = async (token) => {
    const { type } = jwt.verify(token, process.env.JWT_SECRET)
    const entity = entities[type]
    if (!entity) return false

    const activationToken = await entity.resetPasswordTokenModel.findOne({
      where: {
        token,
        used: false,
        expirationDate: {
          [sequelizeDb.Sequelize.Op.gt]: new Date()
        }
      }
    })

    if (!activationToken) return false

    activationToken.used = true
    await activationToken.save()

    return true
  }

  createCredentials = async (token, password) => {
    const { id, type } = jwt.verify(token, process.env.JWT_SECRET)
    const entity = entities[type]
    const userEntity = await entity.model.findOne({ where: { id } })

    const credentials = {
      [`${type}Id`]: userEntity.id,
      email: userEntity.email,
      password: bcrypt.hashSync(password, 8),
      lastPasswordChange: new Date()
    }

    await entity.credentialModel.create(credentials)
  }

  resetCredentials = async (token, password) => {
    const { id, type } = jwt.verify(token, process.env.JWT_SECRET)
    const entity = entities[type]
    const userEntity = await entity.model.findOne({ where: { id } })

    const credentials = {
      password: bcrypt.hashSync(password, 8),
      lastPasswordChange: new Date()
    }

    await entity.credentialModel.update(credentials, {
      where: {
        [`${type}Id`]: userEntity.id
      }
    })
  }
}
