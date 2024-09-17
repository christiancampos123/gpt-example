const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 4343 })

const broadcast = (channel, data) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ channel, data }))
    }
  })
}

module.exports = { broadcast }
