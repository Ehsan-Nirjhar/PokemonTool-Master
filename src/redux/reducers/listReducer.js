import * as d3 from 'd3'

import { toggleFilter, removeFilter, addFilter, updateFilter, clearFilter, clearFilters } from './list'
import { TOGGLE_FILTER, REMOVE_FILTER, ADD_FILTER, UPDATE_FILTER, CLEAR_FILTER, CLEAR_FILTERS } from '../actions'

import pokemon from '../../data/pokemon.json'

// Generate static scales for stats
let scales = {}
scales['HP'] = d3.scaleLinear()
  .domain([0, d3.max(pokemon, (d) => d['HP'])])
  .range([0, 100])
scales['Attack'] = d3.scaleLinear()
  .domain([0, d3.max(pokemon, (d) => d['Attack'])])
  .range([0, 100])
scales['Defense'] = d3.scaleLinear()
  .domain([0, d3.max(pokemon, (d) => d['Defense'])])
  .range([0, 100])
scales['Special_Attack'] = d3.scaleLinear()
  .domain([0, d3.max(pokemon, (d) => d['Special_Attack'])])
  .range([0, 100])
scales['Special_Defense'] = d3.scaleLinear()
  .domain([0, d3.max(pokemon, (d) => d['Special_Defense'])])
  .range([0, 100])
scales['Speed'] = d3.scaleLinear()
  .domain([0, d3.max(pokemon, (d) => d['Speed'])])
  .range([0, 100])

const initialState = {
  pokemon: pokemon,
  filteredPokemon: pokemon,
  scales: scales,
  filters: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_FILTER: {
      return toggleFilter(state, action.filterObject)
    }
    case REMOVE_FILTER: {
      return removeFilter(state, action.filterObject)
    }
    case ADD_FILTER: {
      return addFilter(state, action.filterObject)
    }
    case UPDATE_FILTER: {
      return updateFilter(state, action.filterObject)
    }
    case CLEAR_FILTER: {
      return clearFilter(state, action.filterField)
    }
    case CLEAR_FILTERS: {
      return clearFilters(state)
    }
  }
  return state
}
