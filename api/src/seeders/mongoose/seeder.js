require('dotenv').config({ path: '../../../.env' })
const process = require('process')
const fs = require('fs')
const mongoose = require('mongoose')
const path = require('path')
const basename = path.basename(__filename)

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', async () => {
  const seederFiles = fs.readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js'
      )
    })

  for (const seederFile of seederFiles) {
    try {
      const seeder = require(path.join(__dirname, seederFile))
      await seeder(mongoose)
      console.log(`Éxito al ejecutar el seeder: ${seederFile}`)
    } catch (error) {
      console.error(`Error al ejecutar el seeder: ${seederFile}`, error)
    }
  }
})
