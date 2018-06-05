export const TOGGLE_FILTER = 'TOGGLE_FILTER'
export const toggleFilter = (filterObject) => {
  return {
    type: TOGGLE_FILTER,
    filterObject: filterObject
  }
}

export const REMOVE_FILTER = 'REMOVE_FILTER'
export const removeFilter = (filterObject) => {
  return {
    type: REMOVE_FILTER,
    filterObject: filterObject
  }
}

export const ADD_FILTER = 'ADD_FILTER'
export const addFilter = (filterObject) => {
  return {
    type: ADD_FILTER,
    filterObject: filterObject
  }
}

export const UPDATE_FILTER = 'UPDATE_FILTER'
export const updateFilter = (filterObject) => {
  return {
    type: UPDATE_FILTER,
    filterObject: filterObject
  }
}

export const CLEAR_FILTER = 'CLEAR_FILTER'
export const clearFilter = (filterField) => {
  return {
    type: CLEAR_FILTER,
    filterField: filterField
  }
}

export const CLEAR_FILTERS = 'CLEAR_FILTERS'
export const clearFilters = () => {
  return {
    type: CLEAR_FILTERS
  }
}
