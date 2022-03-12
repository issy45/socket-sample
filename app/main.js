const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const socket = io()

const me = {
  x: 10,
  y: 10,
  color: 'green',
}

const other = {
  x: 10,
  y: 10,
  color: 'red',
}

document.addEventListener('keydown', (e) => {
  const key = e.key.replace('Arrow', '')
  const [dx, dy] = (() => {
    switch (key) {
      case 'Left':
        return [-2, 0]
      case 'Right':
        return [2, 0]
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

const moveMyBall = (dx, dy) => {
  me.x += dx
  me.y += dy
  socket.emit('moveBall', [me.x, me.y].join(':'))
}

const moveOtherBall = (x, y) => {
  other.x = x
  other.y = y
}

socket.on('broadcast', (msg) => {
  const [x, y] = msg.split(':')
  moveOtherBall(x, y)
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
  drawBall(other)
}

render()
