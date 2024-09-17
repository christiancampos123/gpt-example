const uuid = require('uuid')
const mongooseDb = require('../../models/mongoose')
const Menu = mongooseDb.Menu

exports.create = async (req, res) => {
  try {
    const localeKey = Object.keys(req.body.locales)[0]
    req.body.locales[localeKey].id = uuid.v4()
    req.body.locales[localeKey].createdAt = new Date()
    req.body.locales[localeKey].updatedAt = new Date()
    req.body.locales[localeKey].deletedAt = null

    const update = {}
    update['items.' + localeKey] = req.body.locales[localeKey]
    await Menu.findByIdAndUpdate(req.body.parentId, { $push: update })
    res.status(200).send(req.body.locales[localeKey])
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: err.errors || 'Algún error ha surgido al insertar el dato.'
    })
  }
}

exports.findAll = async (req, res) => {
  const whereStatement = {}
  whereStatement.deletedAt = { $exists: false }
  whereStatement._id = req.query.parent

  try {
    const result = await Menu.findOne(whereStatement)
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    const response = {
      rows: (result.items && result.items[req.query.language])
        ? result.items[req.query.language].filter(item => !item.deletedAt).map(row => ({
          ...row,
          url: row.urlExternal || row.urlInternal
        }))
        : []
    }

    res.status(200).send(response)
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: err.message || 'Algún error ha surgido al recuperar los datos.'
    })
  }
}

exports.findOne = async (req, res) => {
  const id = req.params.id

  try {
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }
    whereStatement._id = req.query.parent

    const result = await Menu.findOne(whereStatement)
      .lean()
      .exec()

    let data = result.items[req.query.language].find(item => item.id === id)

    if (data) {
      const newData = {}

      for (const key in data) {
        if (key === 'id') continue
        if (!newData.locales) newData.locales = {}
        if (!newData.locales[req.query.language]) newData.locales[req.query.language] = {}
        newData.locales[req.query.language][key] = data[key]
      }

      data = newData
      data.id = id

      res.status(200).send(data)
    } else {
      res.status(404).send({
        message: `No se puede encontrar el elemento con la id=${id}.`
      })
    }
  } catch (err) {
    res.status(500).send({
      message: 'Algún error ha surgido al recuperar la id=' + id
    })
  }
}

exports.update = async (req, res) => {
  const id = req.params.id

  try {
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }
    whereStatement._id = req.body.parentId

    const result = await Menu.findOne(whereStatement)
      .lean()
      .exec()

    const data = result.items[req.body.language].find(item => item.id === id)

    if (data) {
      const update = {}

      for (const locale in req.body.locales) {
        for (const key in req.body.locales[locale]) {
          update[`items.${locale}.$.${key}`] = req.body.locales[locale][key]
        }
      }

      await Menu.updateOne(
        { _id: req.body.parentId, [`items.${req.body.language}.id`]: id },
        { $set: update },
        { arrayFilters: [{ 'elem.id': id }] }
      )

      res.status(200).send({
        message: 'El elemento ha sido actualizado correctamente.'
      })
    } else {
      res.status(404).send({
        message: `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento o el cuerpo de la petición está vacío.`
      })
    }
  } catch (err) {
    res.status(500).send({
      message: 'Algún error ha surgido al actualizar la id=' + id
    })
  }
}

exports.delete = async (req, res) => {
  const id = req.params.id

  try {
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }
    whereStatement._id = req.query.parent

    const result = await Menu.findOne(whereStatement)
      .lean()
      .exec()

    const data = result.items[req.query.language].find(item => item.id === id)

    if (data) {
      await Menu.updateOne(
        { _id: req.query.parent },
        { $pull: { [`items.${req.query.language}`]: { id } } }
      )

      res.status(200).send({
        message: 'El elemento ha sido borrado correctamente.'
      })
    } else {
      res.status(404).send({
        message: `No se puede borrar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento o el cuerpo de la petición está vacío.`
      })
    }
  } catch (err) {
    res.status(500).send({
      message: 'Algún error ha surgido al borrar la id=' + id
    })
  }
}

exports.updateOrder = async (req, res) => {
  try {
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }
    whereStatement._id = req.body.parent

    const result = await Menu.findOne(whereStatement).exec()
    const data = result.items.get(req.body.language)

    if (data) {
      req.body.items.forEach(item => {
        const foundItem = data.find(d => d.id === item.id)
        if (foundItem) {
          foundItem.parent = item.parent
          foundItem.order = item.order
        }
      })

      result.items.set(req.body.language, data)
      result.markModified('items')
      await result.save()

      res.status(200).send({
        message: 'El orden ha sido actualizado correctamente.'
      })
    } else {
      res.status(404).send({
        message: 'No se puede actualizar el orden. Tal vez no se ha encontrado el elemento o el cuerpo de la petición está vacío.'
      })
    }
  } catch (err) {
    res.status(500).send({
      message: 'Algún error ha surgido al actualizar el orden'
    })
  }
}

exports.sortableItems = async (req, res) => {
  try {
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }
    whereStatement._id = req.query.parent

    const result = await Menu.findOne(whereStatement).exec()
    const items = result.items.get(req.query.language)
    const orderItems = items.sort((a, b) => a.order - b.order)

    const data = []

    orderItems.forEach(item => {
      item.label = item.title
      item.value = item.urlInternal || item.urlExternal
      if (item.parent == null) {
        data.push(sortableChildren(item, items))
      }
    })

    res.status(200).send(data)
  } catch (error) {
    console.error('Error al construir el menú:', error)
  }
}

function sortableChildren (item, items) {
  const parentItem = { ...item, children: [] }
  items.forEach(child => {
    child.label = child.title
    child.value = child.urlInternal || child.urlExternal
    if (child.parent === item.id) {
      parentItem.children.push(sortableChildren(child, items))
    }
  })
  return parentItem
}
