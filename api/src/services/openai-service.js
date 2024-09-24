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

  filterProducts = async (prompt, data) => {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: [
              {
                type: 'text',
                text: 'Ante la pregunta del usuario, proporciona una respuesta humana que contenga los elementos que más se acerquen a la búsqueda del usuario y contengan la url de cada elemento (entre las etiquetas <url></url>). Si no encuentras nada responde "No he encontrado nada".'
              }
            ]
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `El usuario ha preguntado lo siguiente: ${prompt}, y estos son los datos que se han obtenido: ${data}`
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
    } catch (error) {
      console.log(error)
    }
  }

  extractKeywordsAndCategory = async (prompt) => {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: [
              {
                type: 'text',
                text: ' Extrae en formato JSON una categoría entre "juego", "consola", "consola y juego", "accesorio" que resuma la frase aportada por el usuario. Además extrae las palabras clave, elige un máximo de 6 palabras que sean relevantes para describir el producto de manera única e identificable. Ejemplo: {"keywords": ["gameboy", "pocket", "roja"], category: "consola"}'
              }
            ]
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `${prompt}`
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
          type: 'json_object'
        }
      })

      return JSON.parse(response.choices[0].message.content)
    } catch (error) {
      console.log(error)
    }
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
