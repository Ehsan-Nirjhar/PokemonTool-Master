var redis = require('redis')

var client = redis.createClient()
var dataset = []

client.on('connect', keys)

function keys () {
  client.keys('*', function (e, res) {
    res.forEach(data)
    client.quit()
  })
}

function data (k, i, arr) {
  client.get(k, function (e, obj) {
    obj = JSON.parse(obj)
    obj.id = k
    dataset.push(obj)
    if (i === arr.length - 1) {
      log(dataset)
    }
  })
}

function log (obj) {
  console.log((JSON.stringify(obj, null, '  ')))
}
