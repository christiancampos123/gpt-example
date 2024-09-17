const mongooseDb = require('../../models/mongoose')
const Menu = mongooseDb.Menu

exports.getMenuItems = async (req, res) => {
  const name = req.params.name
  const environment = 'customer'

  try {
    const result = await Menu.findOne({ name, environment }).lean().exec()

    if (!result) {
      return res.status(404).send({
        message: `No se puede encontrar el menú con el nombre=${name}.`
      })
    }

    const response =
      (result.items && result.items[req.userLanguage])
        ? result.items[req.userLanguage].filter(item => !item.deletedAt).map(row => ({
          url: row.urlExternal || row.urlInternal,
          title: row.title,
          description: row.description
        }))
        : null

    res.status(200).send(response)
  } catch (err) {
    res.status(500).send({
      message: 'Algún error ha surgido al recuperar el menú con el nombre=' + name
    })
  }
}
