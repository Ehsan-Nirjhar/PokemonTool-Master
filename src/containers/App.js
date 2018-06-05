import React, { PropTypes } from 'react'
import { Link } from 'react-router'

class App extends React.Component {
  render () {
    return (
      <div>
        <header>
          <div className='row'>
            <nav>
              <ul>
                <li><Link to='/start' activeClassName='active'>Start</Link></li>
                <li><Link to='/irb' activeClassName='active'>IRB</Link></li>
                <li><Link to='/background' activeClassName='active'>Background</Link></li>
                <li><Link to='/info' activeClassName='active'>Info</Link></li>
                <li><Link to='/vis' activeClassName='active'>Vis</Link></li>
                <li><Link to='/questionnaire' activeClassName='active'>Questionnaire</Link></li>
                <li><Link to='/end' activeClassName='active'>End</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.any
}

export default App
