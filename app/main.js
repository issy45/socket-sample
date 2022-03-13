const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const socket = io()

const me = {}
const others = {}

socket.on('connect', () => {
  me.id = socket.id
  me.x = 10
  me.y = 10
  me.color = 'green'

  render()
})

document.addEventListener('keydown', (e) => {
  const key = e.key.replace('Arrow', '')
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

  moveMyBall(dx, dy)
  render()
}, false)

const addBall = (id, x, y) => {
  others[id] = {
    id: id,
    x: x,
    y: y,
    color: 'red',
  }
}

const moveMyBall = (dx, dy) => {
  me.x += dx
  me.y += dy
  socket.emit('moveBall', me)
}

const moveOtherBall = (id, x, y) => {
  if (id in others) {
    others[id].x = x
    others[id].y = y
  } else {
    addBall(id, x, y)
  }
}

socket.on('addUser', (id) => {
  socket.emit('moveBall', me)
})

socket.on('removeUser', (id) => {
  delete others[id]
  render()
})

socket.on('moveOtherBall', ({ id, x, y }) => {
  moveOtherBall(id, x, y)
  render()
})

const drawBall = (object) => {
  ctx.beginPath()
  ctx.arc(object.x, object.y, 20, 0, Math.PI * 2, false)
  ctx.fillStyle = object.color
  ctx.fill()
  ctx.closePath()
}

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBall(me)
  Object.keys(others).forEach((key) => {
    drawBall(others[key])
  })
}

render()
