var app = require('http').createServer()
var io = require('socket.io')(app)
var redis = require('redis')
var client = redis.createClient()

app.listen(8080)

// Store id for session
var id = ''

// Need labeled keys for incoming data
var data = {
  id: id
}

function save () {
  client.set(id, JSON.stringify(data))
}

io.on('connection', function (socket) {
  socket.on('id', function (value) {
    id = value
    data.id = id
  })

  socket.on('add', function (key, value) {
    if (key in data) {
      data[key].push(value)
    } else {
      data[key] = []
      data[key].push(value)
    }
    save()
  })

  socket.on('set', function (key, value) {
    data[key] = value
  })

  socket.on('save', function () {
    save()
  })
})
