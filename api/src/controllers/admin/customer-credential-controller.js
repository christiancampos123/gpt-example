const sequelizeDb = require('../../models/sequelize')
const CustomerStaffCredential = sequelizeDb.CustomerStaffCredential
const Op = sequelizeDb.Sequelize.Op

exports.create = async (req, res) => {
  try {
    const customerStaffCredential = await CustomerStaffCredential.findOne({ where: { customerStaffId: req.body.customerStaffId } })

    if (!customerStaffCredential) {
      req.redisClient.publish('new-customer-staff-credentials', JSON.stringify({ id: req.body.customerStaffId }))
      res.status(200).send(req.body)
    } else {
      res.status(409).send({
        message: 'El usuario ya tiene credenciales.'
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: err.errors || 'Algún error ha surgido al insertar el dato.'
    })
  }
}

exports.findAll = (req, res) => {
  const page = req.query.page || 1
  const limit = parseInt(req.query.size) || 10
  const offset = (page - 1) * limit
  const whereStatement = {}
  whereStatement.deletedAt = null

  for (const key in req.query) {
    if (req.query[key] !== '' && req.query[key] !== 'null' && key !== 'page' && key !== 'size') {
      whereStatement[key] = { [Op.substring]: req.query[key] }
    }
  }

  const condition = Object.keys(whereStatement).length > 0 ? { [Op.and]: [whereStatement] } : {}

  CustomerStaffCredential.findAndCountAll({
    where: condition,
    attributes: ['id', 'email', 'lastPasswordChange'],
    include: [
      {
        model: sequelizeDb.CustomerStaff,
        as: 'customerStaff',
        attributes: ['id', 'name', 'surname'],
        include: [
          {
            model: sequelizeDb.Customer,
            as: 'customer',
            attributes: ['id', 'commercialName']
          },
          {
            model: sequelizeDb.StaffCategory,
            as: 'staffCategory',
            attributes: ['id', 'name']
          }
        ]
      }
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  })
    .then(result => {
      result.meta = {
        total: result.count,
        pages: Math.ceil(result.count / limit),
        currentPage: page,
        size: limit
      }

      result.rows = result.rows.map(row => {
        row.dataValues.companyStaff = row.customerStaff.name + ' ' + row.customerStaff.surname
        row.dataValues.company = row.customerStaff.customer.commercialName
        row.dataValues.staffCategory = row.customerStaff.staffCategory.name
        return row
      })

      res.status(200).send(result)
    }).catch(err => {
      console.log(err)
      res.status(500).send({
        message: err.errors || 'Algún error ha surgido al recuperar los datos.'
      })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  CustomerStaffCredential.findByPk(id, {
    attributes: ['id'],
    include: [
      {
        model: sequelizeDb.CustomerStaff,
        as: 'customerStaff',
        attributes: ['id', 'customerId']
      }
    ]
  }).then(data => {
    if (data) {
      data.dataValues.customerStaffId = data.customerStaff.id
      data.dataValues.customerId = data.customerStaff.customerId
      res.status(200).send(data)
    } else {
      res.status(404).send({
        message: `No se puede encontrar el elemento con la id=${id}.`
      })
    }
  }).catch(_ => {
    res.status(500).send({
      message: 'Algún error ha surgido al recuperar la id=' + id
    })
  })
}

exports.update = (req, res) => {
  const id = req.params.id

  CustomerStaffCredential.update(req.body, {
    where: { id }
  }).then(([numberRowsAffected]) => {
    if (numberRowsAffected === 1) {
      res.status(200).send({
        message: 'El elemento ha sido actualizado correctamente.'
      })
    } else {
      res.status(404).send({
        message: `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento o el cuerpo de la petición está vacío.`
      })
    }
  }).catch(_ => {
    res.status(500).send({
      message: 'Algún error ha surgido al actualiazar la id=' + id
    })
  })
}

exports.delete = (req, res) => {
  const id = req.params.id

  CustomerStaffCredential.destroy({
    where: { id }
  }).then(([numberRowsAffected]) => {
    if (numberRowsAffected === 1) {
      res.status(200).send({
        message: 'El elemento ha sido borrado correctamente'
      })
    } else {
      res.status(404).send({
        message: `No se puede borrar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento.`
      })
    }
  }).catch(_ => {
    res.status(500).send({
      message: 'Algún error ha surgido al borrar la id=' + id
    })
  })
}
