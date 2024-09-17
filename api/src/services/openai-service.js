const dotenv = require('dotenv').config()
const OpenAI = require('openai')

module.exports = class OpenAIService {
  constructor () {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    this.threadId = null
    this.messages = null
    this.answer = null
  }

  async getAssistants () {
    const myAssistants = await this.openai.beta.assistants.list({
      order: 'desc',
      limit: '20'
    })

    return myAssistants.data
  }

  async createThread () {
    try {
      const thread = await this.openai.beta.threads.create()
      this.threadId = thread.id
    } catch (error) {
      console.log(error)
    }
  }

  setThread (theadId) {
    this.threadId = theadId
  }

  async createMessage (prompt) {
    try {
      await this.openai.beta.threads.messages.create(
        this.threadId,
        {
          role: 'user',
          content: prompt
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  async createAnswer (assistantEndpoint) {
    try {
      this.run = await this.openai.beta.threads.runs.createAndPoll(
        this.threadId,
        {
          assistant_id: assistantEndpoint
        }
      )

      if (this.run.status === 'completed') {
        const messages = await this.openai.beta.threads.messages.list(this.run.thread_id)
        this.messages = messages.data
        this.answer = this.messages[0].content[0].text.value
      } else {
        console.log(this.run.status)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async getResume (prompt, answer) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: 'Haz un resumen de no más de 30 caracteres del contenido de prompt y answer.'
            }
          ]
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `prompt: ${prompt}\n answer: ${answer}`
            }
          ]
        }
      ],
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
        type: 'text'
      }
    })

    return response.choices[0].message.content
  }

  extractCode (response) {
    const regex = /```([^```]+)```/g
    const matches = response.match(regex)

    if (matches && matches.length > 0) {
      response = matches[0].replace(/```/g, '')
      return response
    } else {
      return response
    }
  }
}
