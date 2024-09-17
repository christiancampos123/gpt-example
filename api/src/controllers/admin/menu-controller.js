const moment = require('moment')
const mongooseDb = require('../../models/mongoose')
const Menu = mongooseDb.Menu

exports.create = async (req, res) => {
  try {
    let data = await Menu.create(req.body)
    data = data.toObject()
    data.id = data._id
    res.status(200).send(data)
  } catch (err) {
    res.status(500).send({
      message: err.errors || 'Algún error ha surgido al insertar el dato.'
    })
  }
}

exports.findAll = async (req, res) => {
  const page = req.query.page || 1
  const limit = parseInt(req.query.size) || 10
  const offset = (page - 1) * limit
  const whereStatement = {}
  whereStatement.deletedAt = { $exists: false }

  for (const key in req.query) {
    if (req.query[key] !== '' && req.query[key] !== 'null' && key !== 'page' && key !== 'size') {
      whereStatement[key] = { $regex: req.query[key], $options: 'i' }
    }
  }

  try {
    const result = await Menu.find(whereStatement)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    const count = await Menu.countDocuments(whereStatement)

    const response = {
      rows: result.map(doc => ({
        ...doc,
        id: doc._id,
        _id: undefined,
        createdAt: moment(doc.createdAt).format('YYYY-MM-DD HH:mm'),
        updatedAt: moment(doc.updatedAt).format('YYYY-MM-DD HH:mm')
      })),
      meta: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: page
      }
    }

    res.status(200).send(response)
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Algún error ha surgido al recuperar los datos.'
    })
  }
}

exports.findOne = async (req, res) => {
  const id = req.params.id

  try {
    const data = await Menu.findById(id).lean().exec()

    if (data) {
      data.id = data._id
    }

    if (data) {
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
    const data = await Menu.findByIdAndUpdate(id, req.body, { new: true }).lean().exec()

    if (data) {
      data.id = data._id

      res.status(200).send(data)
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
    const data = await Menu.findByIdAndUpdate(id, { deletedAt: new Date() })

    if (data) {
      res.status(200).send({
        message: 'El elemento ha sido borrado correctamente.'
      })
    } else {
      res.status(404).send({
        message: `No se puede borrar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento.`
      })
    }
  } catch (err) {
    res.status(500).send({
      message: 'Algún error ha surgido al borrar la id=' + id
    })
  }
}

exports.getMenuItems = async (req, res) => {
  const name = req.params.name
  const environment = 'admin'

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
