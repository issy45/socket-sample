const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
app.get('/main.js', (req, res) => {
  res.sendFile(__dirname + '/main.js')
})

const sharedObject = {
  id: null,
  x: 390,
  y: 190,
  color: 'yellow',
}

io.on('connection', (socket) => {
  socket.emit('sharedObject', sharedObject)

  socket.broadcast.emit('addUser', socket.id)

  socket.on('disconnect', () => {
    socket.broadcast.emit('removeUser', socket.id)
  })

  socket.on('movePlayer', ({ id, x, y }) => {
    socket.broadcast.emit('moveOtherPlayer', { id: id, x: x, y: y })
  })

  socket.on('moveSharedObject', ({ dx, dy, color }) => {
    sharedObject.x += dx
    sharedObject.y += dy
    sharedObject.color = color
    socket.emit('sharedObject', sharedObject)
    socket.broadcast.emit('sharedObject', sharedObject)
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
