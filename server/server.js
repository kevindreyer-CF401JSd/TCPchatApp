const net = require('net')
const server = net.createServer()

const PORT = process.env.PORT || 3001

server.listen(PORT, () => console.log(`server is up on ${PORT}`))

const socketPool = {}

server.on('connection', socket => {
  const id = `Socket-${Math.random()}`
  socketPool[id] = socket
  socket.on('data', buffer => doSomething(buffer))
  socket.on('error', e => console.error('SOCKET ERROR', e))
  socket.on('end', () => delete socketPool[id])
})

server.on('error', e => console.error('SERVER ERROR!', e))

function doSomething (buffer) {
  // how could we extend this
  const message = JSON.parse(buffer.toString().trim())
  broadcast(message)
}

function broadcast (message) {
  const payload = JSON.stringify(message)
  for (const socket in socketPool) {
    socketPool[socket].write(payload)
  }
  console.log('payload',payload)
}