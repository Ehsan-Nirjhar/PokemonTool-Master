import mergewith from 'lodash.mergewith'
import remove from 'lodash.remove'
import isArray from 'lodash.isarray'
import isempty from 'lodash.isempty'
import keys from 'lodash.keys'
import values from 'lodash.values'
import has from 'lodash.has'

// private helper function for lodash.mergewith
const customizer = (objValue, srcValue) => {
  if (isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}

// private helper function filtering array
const applyFilters = (data, filterObject) => {
  // Return all data if filter object is empty
  if (isempty(filterObject)) {
    return data
  }

  let filteredData = []

  // Get relevant keys from filterObject for dataset
  let keyArr = keys(data[0])
  for (let i = 0; i < data.length; i++) {
    let datum = data[i]
    let keep = true
    for (let j = 0; j < keyArr.length; j++) {
      if (has(filterObject, keyArr[j])) {
        if (keyArr[j] === 'Generation') {
          let value = datum[keyArr[j]] + ''
          if (filterObject[keyArr[j]].indexOf(value) === -1) {
            keep = false
          }
        } else if (keyArr[j] === 'Types') {
          // // Code to have at least one
          // keep = false
          // for (var k = 0; k < datum[keyArr[j]].length; k++) {
          //   let value = datum[keyArr[j]][k]
          //   if (filterObject[keyArr[j]].indexOf(value) > -1) {
          //     keep = true
          //   }
          // }
          // Code to require all
          for (var k = 0; k < filterObject[keyArr[j]].length; k++) {
            let value = filterObject[keyArr[j]][k]
            if (datum[keyArr[j]].indexOf(value) < 0) {
              keep = false
            }
          }
        }
      }
    }

    if (keep) {
      filteredData.push(datum)
    }
  }

  return filteredData
}

// NOTE: Only uses first key with it's first value in its array
const toggleFilter = (state, filterObject) => {
  let key = keys(filterObject)[0]
  let value = values(filterObject)[0][0]
  // Has associated value, therefore more checks required
  if (has(state.filters, key)) {
    // Has key with associated value in array
    if (state.filters[key].indexOf(value) > -1) {
      return removeFilter(state, filterObject)
    } else { // Has key but lacks associated value
      return addFilter(state, filterObject)
    }
  } else { // Lacks any associated key
    return addFilter(state, filterObject)
  }
}

const removeFilter = (state, filterObject) => {
  let key = keys(filterObject)[0]

  let newAttributes = remove(state.filters[key], (a) => {
    return filterObject[key].indexOf(a)
  })

  if (newAttributes.length > 0) {
    state.filters[key] = newAttributes
  } else {
    delete state.filters[key]
  }

  return {
    pokemon: state.pokemon,
    filteredPokemon: applyFilters(state.pokemon, state.filters),
    scales: state.scales,
    filters: state.filters
  }
}

const addFilter = (state, filterObject) => {
  let newFilterObject = mergewith(state.filters, filterObject, customizer)
  return {
    pokemon: state.pokemon,
    filteredPokemon: applyFilters(state.pokemon, newFilterObject),
    scales: state.scales,
    filters: newFilterObject
  }
}

// NOTE: Overrides current filter values
//  creates filter if it doesn't exist
const updateFilter = (state, filterObject) => {
  let key = keys(filterObject)[0]
  let value = values(filterObject)[0]

  let newFilterObject = {}
  newFilterObject = state.filters
  newFilterObject[key] = value

  return {
    pokemon: state.pokemon,
    filteredPokemon: applyFilters(state.pokemon, newFilterObject),
    scales: state.scales,
    filters: newFilterObject
  }
}

const clearFilter = (state, filterField) => {
  let newFilterObject = {}
  newFilterObject = state.filters
  delete newFilterObject[filterField]

  return {
    pokemon: state.pokemon,
    filteredPokemon: applyFilters(state.pokemon, newFilterObject),
    scales: state.scales,
    filters: newFilterObject
  }
}

const clearFilters = (state) => {
  return {
    pokemon: state.pokemon,
    filteredPokemon: state.pokemon,
    scales: state.scales,
    filters: {}
  }
}

export { toggleFilter, addFilter, removeFilter, updateFilter, clearFilter, clearFilters }
