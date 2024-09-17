'use strict'

require('dotenv').config()
const fs = require('fs')
const process = require('process')
const mongoose = require('mongoose')
const path = require('path')
const basename = path.basename(__filename)
const mongooseDb = {}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message)
  }
}

connectDB()

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    )
  })
  .forEach(file => {
    const modelName = file.split('.')[0]
    const formattedModelName = modelName.split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
    const model = require(path.join(__dirname, file))(mongoose)
    mongooseDb[formattedModelName] = model
  })

mongooseDb.mongoose = mongoose

module.exports = mongooseDb
