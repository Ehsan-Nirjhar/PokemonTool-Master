import io from 'socket.io-client'

import config from './config'

class Redis {
  constructor () {
    this.socket = io.connect('http://localhost:8080')
    this.add = this.add.bind(this)

    this.id = config.id

    this.socket.emit('id', this.id)
  }

  add (k, v) {
    this.socket.emit('add', k, v)
  }

  set (k, v) {
    this.socket.emit('set', k, v)
  }

  save () {
    this.socket.emit('save')
  }
}

const redis = new Redis()
export default redis
