const sequelizeDb = require('../../models/sequelize')
const Assistant = sequelizeDb.Assistant
const OpenAIService = require('../../services/openai-service')

exports.findAll = (req, res) => {
  Assistant.findAll({
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: sequelizeDb.AssistantExample,
        as: 'examples'
      }
    ]
  })
    .then(result => {
      res.status(200).send(result)
    }).catch(err => {
      res.status(500).send({
        message: err.errors || 'Algún error ha surgido al recuperar los datos.'
      })
    })
}

exports.assistantResponse = async (req, res) => {
  const openai = new OpenAIService()

  if (req.body.threadId) {
    await openai.setThread(req.body.threadId)
  } else {
    await openai.createThread()
  }

  await openai.createMessage(req.body.prompt)
  await openai.createAnswer(req.body.assistant.assistantEndpoint)

  const data = {
    customerStaffId: req.customerStaffId,
    threadId: openai.threadId,
    assistantName: req.body.assistant.name,
    assistantEndpoint: req.body.assistant.assistantEndpoint,
    run: openai.run,
    messages: openai.messages
  }

  req.redisClient.publish('new-chat-message', JSON.stringify(data))

  const response = {
    threadId: openai.threadId,
    answer: openai.answer
  }

  res.status(200).send(response)
}
