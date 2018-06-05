import React from 'react'
import { Link } from 'react-router'

class Info extends React.Component {
  render () {
    return (
      <div className='container'>
        <h5><Link to='/vis'>START</Link></h5>
      </div>
    )
  }
}

export default Info
