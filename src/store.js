import { applyMiddleware, compose, createStore } from 'redux'
import { reduxReactRouter } from 'redux-router'
import { createHistory } from 'history'

import rootReducer from './redux/reducers'
import { routes } from './routes'

// Tip / Trick from fluent 2016
const debugLogger = (store) => (next) => (action) => {
  console.groupCollapsed('Action \'' + action.type + '\' detected')
  console.info('action:', action)

  const result = next(action)

  console.debug('state:', store.getState())
  console.groupEnd(action.type)

  return result
}

export default (initialState) => {
  const createStoreWithMiddleWare = compose(
    applyMiddleware(debugLogger),
    reduxReactRouter({
      routes,
      createHistory }),
    window.devToolsExtension ? window.devToolsExtension() : (f) => f
  )(createStore)
  return createStoreWithMiddleWare(rootReducer, initialState)
}
