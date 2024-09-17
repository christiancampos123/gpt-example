const data = [
  {
    name: 'Español',
    alias: 'es',
    selected: true,
    default: true
  }
]

module.exports = async function (mongoose) {
  async function insertSeeder () {
    const Model = require('../../models/mongoose/language.js')(mongoose)
    await Model.insertMany(data)
  }

  insertSeeder()
}
