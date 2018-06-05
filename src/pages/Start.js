import React from 'react'
import { Link } from 'react-router'

import config from '../config'

class Start extends React.Component {
  render () {
    return (
      <div className='container'>
        <p>{'Participant ID: ' + config.id}</p>
        <p>Click 'START' whenever you are ready</p>
        <h5><Link to='/vis'>START</Link></h5>
      </div>
    )
  }
}

export default Start
