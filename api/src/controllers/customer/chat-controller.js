const mongooseDb = require('../../models/mongoose')
const Chat = mongooseDb.Chat

exports.findAll = (req, res) => {
  Chat.find({ customerStaffId: req.customerStaffId }, 'assistantEndpoint threadId resume')
    .sort({ createdAt: -1 })
    .then(result => {
      console.log(result)
      res.status(200).send(result)
    }).catch(err => {
      res.status(500).send({
        message: err.errors || 'Algún error ha surgido al recuperar los datos.'
      })
    })
}

exports.findLast = (req, res) => {
  Chat.findOne({ customerStaffId: req.customerStaffId }, 'assistantEndpoint threadId resume')
    .sort({ createdAt: -1 })
    .then(result => {
      res.status(200).send(result)
    }).catch(err => {
      res.status(500).send({
        message: err.errors || 'Algún error ha surgido al recuperar los datos.'
      })
    })
}
