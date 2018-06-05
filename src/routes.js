import React from 'react'
import { Route, Router, IndexRedirect, browserHistory } from 'react-router'
import { ReduxRouter } from 'redux-router'

import App from './containers/App'
import Start from './pages/Start'
import Irb from './pages/Irb'
import Background from './pages/Background'
import Info from './pages/Info'
import Vis from './pages/Vis'
import Questionnaire from './pages/Questionnaire'
import End from './pages/End'

const routes = (
  <ReduxRouter>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRedirect to='/start' />
        <Route path='/start' component={Start} />
        <Route path='/irb' component={Irb} />
        <Route path='/background' component={Background} />
        <Route path='/info' component={Info} />
        <Route path='/vis' component={Vis} />
        <Route path='/questionnaire' component={Questionnaire} />
        <Route path='/end' component={End} />
      </Route>
    </Router>
  </ReduxRouter>
)

export default routes
