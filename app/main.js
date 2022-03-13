const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const socket = io()

const me = {}
const others = {}
const sharedObject = {}

socket.on('connect', () => {
  me.id = socket.id
  me.x = 10
  me.y = 10
  me.color = 'green'

  render()
})

document.addEventListener('keydown', (e) => {
  const key = e.key.replace('Arrow', '')

  switch (key) {
    case 'a':
      socket.emit('moveSharedObject', {dx: -2, dy: 0, color: sharedObject.color})
      return
    case 's':
      socket.emit('moveSharedObject', {dx: 0, dy: 2, color: sharedObject.color})
      return
    case 'w':
      socket.emit('moveSharedObject', {dx: 0, dy: -2, color: sharedObject.color})
      return
    case 'd':
      socket.emit('moveSharedObject', {dx: 2, dy: 0, color: sharedObject.color})
      return
    case 'r':
      socket.emit('moveSharedObject', {dx: 0, dy: 0, color: 'red'})
      return
    case 'g':
      socket.emit('moveSharedObject', {dx: 0, dy: 0, color: 'green'})
      return
    case 'b':
      socket.emit('moveSharedObject', {dx: 0, dy: 0, color: 'blue'})
      return
    case 'y':
      socket.emit('moveSharedObject', {dx: 0, dy: 0, color: 'yellow'})
      return
    case 'p':
      socket.emit('moveSharedObject', {dx: 0, dy: 0, color: 'pink'})
      return
    case 'c':
      socket.emit('moveSharedObject', {dx: 0, dy: 0, color: 'cyan'})
      return
    case 'o':
      socket.emit('moveSharedObject', {dx: 0, dy: 0, color: 'orange'})
      return
  }

  const [dx, dy] = (() => {
    switch (key) {
      case 'Right':
        return [2, 0]
      case 'Left':
        return [-2, 0]
      case 'Up':
        return [0, -2]
      case 'Down':
        return [0, 2]
      default:
        return [0, 0]
    }
  })(key)

  if (dx === 0 && dy === 0) {
    return
  }

  moveMe(dx, dy)
  render()
}, false)

const addPlayer = (id, x, y) => {
  others[id] = {
    id: id,
    x: x,
    y: y,
    color: 'red',
  }
}

const moveMe = (dx, dy) => {
  me.x += dx
  me.y += dy
  socket.emit('movePlayer', me)
}

const moveOtherPlayer = (id, x, y) => {
  if (id in others) {
    others[id].x = x
    others[id].y = y
  } else {
    addPlayer(id, x, y)
  }
}

socket.on('addUser', (id) => {
  addPlayer(id, 10, 10)
  socket.emit('movePlayer', me)
})

socket.on('removeUser', (id) => {
  delete others[id]
  render()
})

socket.on('sharedObject', ({ id, x, y, color }) => {
  sharedObject.id = id
  sharedObject.x = x
  sharedObject.y = y
  sharedObject.color = color
  render()
})

socket.on('moveOtherPlayer', ({ id, x, y }) => {
  moveOtherPlayer(id, x, y)
  render()
})

const drawPlayer = (object) => {
  ctx.beginPath()
  ctx.rect(object.x, object.y, 20, 20)
  ctx.fillStyle = object.color
  ctx.fill()
  ctx.closePath()
}

const drawSharedObject = () => {
  ctx.beginPath()
  ctx.arc(sharedObject.x, sharedObject.y, 10, 0, Math.PI * 2, false)
  ctx.fillStyle = sharedObject.color
  ctx.fill()
  ctx.closePath()
}

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawSharedObject()
  drawPlayer(me)
  Object.keys(others).forEach((key) => {
    drawPlayer(others[key])
  })
}

render()
