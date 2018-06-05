import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'

import createStore from './store'
import redis from './redis'
import routes from './routes'

import './styles/main.styl'
import ico from './favicon.png'
document.getElementById('favicon').setAttribute('href', ico)

const store = window.store = createStore()
window.redis = redis

ReactDom.render(
  <Provider store={store}>
    {routes}
  </Provider>
  , document.getElementById('root')
)
