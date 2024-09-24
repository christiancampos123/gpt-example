const { ChromaClient } = require('chromadb')
const OpenAIService = require('../services/openai-service')
const telegramToken = process.env.TELEGRAM_TOKEN
const telegramChatId = process.env.TELEGRAM_CHAT_ID

async function example () {
  const client = new ChromaClient()
  const openai = new OpenAIService()
  const chromadbCollection = await client.getOrCreateCollection({ name: 'wallapop' })
  const prompt = 'Estoy buscando una gameboy por menos de 70 euros en buen estado'
  const object = await openai.extractKeywordsAndCategory(prompt)

  const result = await chromadbCollection.query({
    nResults: 10,
    queryTexts: [object.keywords.join(' ')],
    where: {
      category: object.category
    }
  })

  console.log(result)

  const data = []

  for (let i = 0; i < result.documents[0].length; i++) {
    const url = result.metadatas[0][i].url
    const text = result.metadatas[0][i].text
    const price = result.metadatas[0][i].price
    const state = result.metadatas[0][i].state

    data.push({
      url,
      text,
      price,
      state
    })
  }

  console.log(data)

  const text = await openai.filterProducts(prompt, JSON.stringify(data))
  console.log(text)

  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text
      })
    })

    const data = await response.json()

    if (data.ok) {
      console.log('Mensaje enviado:', data)
    } else {
      console.error('Error al enviar el mensaje:', data)
    }
  } catch (e) {
    console.log(e)
  }
}

example()
