const functor = (f, ...args) => {
  return typeof f === 'function'
    ? f(...args)
    : f
}

// Cross browser helpers
const getWidth = () => {
  if (self.innerWidth) {
    return self.innerWidth
  }

  if (document.documentElement && document.documentElement.clientWidth) {
    return document.documentElement.clientWidth
  }

  if (document.body) {
    return document.body.clientWidth
  }
}

const getHeight = () => {
  if (self.innerHeight) {
    return self.innerHeight
  }

  if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientHeight
  }

  if (document.body) {
    return document.body.clientHeight
  }
}

const scrollTop = () => {
  if (document.documentElement && document.documentElement.scrollTop) {
    return document.documentElement.scrollTop
  }

  if (document.body) {
    return document.body.scrollTop
  }
}

const scrollLeft = () => {
  if (document.documentElement && document.documentElement.scrollLeft) {
    return document.documentElement.scrollLeft
  }

  if (document.body) {
    return document.body.scrollLeft
  }
}

const binByNumeric = (data, accessor, range, numBins) => {
  var bins = []
  var step = (range[1] - range[0]) / numBins

  for (let i = 0; i < numBins; i++) {
    var bin = data.filter((d) => {
      return d[accessor] < (range[0] + ((i + 1) * step)) &&
        d[accessor] >= (range[0] + (i * step))
    })
    bin.key = i * step
    bin.step = step
    bin.count = bin.length
    bins.push(bin)
  }

  return bins
}

const binByValue = (data, accessor, maxBins = 0) => {
  var bins = []
  var allBins = []

  data
    .map((d) => d[accessor]) // Create an array of keys in dataset
    .filter((d, i, arr) => arr.indexOf(d) === i) // Filter repeated keys
    .forEach((d) => { // For each unique key
      var bin = data.filter((f) => {
        return f[accessor] === d
      })
      bin.key = d
      bin.count = bin.length
      allBins.push(bin)
    })

  // Keep top bins if max number of bins specified
  if (maxBins !== 0) {
    bins = allBins.sort((a, b) => {
      return b.count - a.count
    }).slice(0, maxBins)
  }

  return bins
}

export { binByValue, binByNumeric, functor, getWidth, getHeight, scrollTop, scrollLeft }
