#!/usr/bin/env node
// Process pokemon csv into digestable json
var d3 = require('d3')
var fs = require('fs')

var fixed = []
var types = []
fs.readFile('pokemon.csv', 'utf-8', function (err, raw) {
  data = d3.csvParse(raw)

  for (var i = 0; i < data.length; i++) {
    var id = data[i]['#'].replace(/\s/g, '')
    var num = Math.floor(+id.replace(/^0+/, ''))
    var index = has(fixed, 'id', id)
    var type = data[i]['Type']

    if (types.indexOf(type) === -1) {
      types.push(type)
    }
    // If already exist add extra typing
    if (index > -1) {
      fixed[index]['Types'].push(type)
    } else {
      // Determine generation
      var gen = -1
      if (num > 0 && num < 152) {
        gen = 1
      } else if (num > 151 && num < 252) {
        gen = 2
      } else if (num > 251 && num < 387) {
        gen = 3
      } else if (num > 386 && num < 494) {
        gen = 4
      } else if (num > 493 && num < 650) {
        gen = 5
      } else if (num > 649 && num < 722) {
        gen = 6
      } else if (num > 721 && num < 803) {
        gen = 7
      }

      // Add to listing
      fixed.push({
        id: id,
        Generation: gen,
        Name: data[i]['Name'],
        Types: [type],
        Total: +data[i]['Total'],
        HP: +data[i]['HP'],
        Attack: +data[i]['Attack'],
        Defense: +data[i]['Defense'],
        Special_Attack: +data[i]['Special Attack'],
        Special_Defense: +data[i]['Special Defense'],
        Speed: +data[i]['Speed']
      })
    }
  }

  dump(fixed, types.sort())
})

// Check array for key with value and return index
function has (arr, key, value) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key] === value) {
      return i
    }
  }

  return -1
}

// Dump to file
function dump(data, types) {
  fs.writeFile('pokemon.json', JSON.stringify(data, null, 4), 'utf8', (error) => {
    if (error) throw error
  })

  fs.writeFile('types.json', JSON.stringify(types, null, 4), 'utf8', (error) => {
    if (error) throw error
  })
}
