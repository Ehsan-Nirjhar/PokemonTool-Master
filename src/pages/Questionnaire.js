import React from 'react'
import { Link } from 'react-router'

class Background extends React.Component {
  render () {
    return (
      <div className='container'>
        <div className='row'>
          <h5><Link to='/end'>NEXT</Link></h5>
        </div>
      </div>
    )
  }
}

export default Background
