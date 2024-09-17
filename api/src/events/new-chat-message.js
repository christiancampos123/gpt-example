const mongooseDb = require('../models/mongoose')
const Chat = mongooseDb.Chat
const OpenAIService = require('../services/openai-service')
const { broadcast } = require('../services/websocket-service')

exports.handleEvent = async (redisClient, subscriberClient) => {
  subscriberClient.subscribe('new-chat-message', (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err)
    }
  })

  subscriberClient.on('message', async (channel, message) => {
    if (channel === 'new-chat-message') {
      const data = JSON.parse(message)
      const chat = await Chat.findOne({ threadId: data.threadId })

      if (chat) {
        chat.messages = data.messages
        chat.run = data.run
        chat.markModified('messages')
        chat.markModified('run')
        await chat.save()
      } else {
        const openai = new OpenAIService()
        const prompt = data.messages[1].content[0].text.value
        const answer = data.messages[0].content[0].text.value
        const resume = await openai.getResume(prompt, answer)

        await Chat.create({
          customerStaffId: data.customerStaffId,
          assistantName: data.assistantName,
          assistantEndpoint: data.assistantEndpoint,
          threadId: data.threadId,
          resume,
          run: data.run,
          messages: data.messages,
          deletedAt: null
        })

        const chatData = {
          threadId: data.threadId,
          resume,
          assistantEndpoint: data.assistantEndpoint
        }

        broadcast('history', chatData)
      }
    }
  })
}
