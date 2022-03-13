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

io.on('connection', (socket) => {
  socket.broadcast.emit('addUser', socket.id)

  socket.on('moveBall', ({ id, x, y }) => {
    socket.broadcast.emit('moveOtherBall', { id: id, x: x, y: y })
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('removeUser', socket.id)
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
