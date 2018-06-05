import React from 'react'

import GridView from '../views/GridView'

class Vis extends React.Component {
  render () {
    return (
      <div className='container'>
        <div className='row'>
          <GridView />
        </div>
      </div>
    )
  }
}

export default Vis
