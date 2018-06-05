import { combineReducers } from 'redux'
import { routerStateReducer } from 'redux-router'
import listReducer from './listReducer'

export default combineReducers({
  list: listReducer,
  router: routerStateReducer
})
