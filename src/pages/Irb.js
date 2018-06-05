import React from 'react'
import { Link } from 'react-router'

class Irb extends React.Component {
  render () {
    return (
      <div className='container'>
        <div className='row'>
          <p>This is where IRB information will go . . .</p>
        </div>
        <div className='row'>
          <h5><Link to='/background'>NEXT</Link></h5>
        </div>
      </div>
    )
  }
}

export default Irb
