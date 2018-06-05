import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import redis from '../redis'

class MultipleChoice extends React.Component {
  render () {
    return (
      <div className='row'>
        <h5>{this.props.title}</h5>
        {this.props.choices.map((d, i) => {
          return (
            <div key={i}>
              <input type='radio' value={d.value} checked={this.props.currentChoice === d.value} onChange={this.props.onChange} />
              <span>{d.label}</span><br />
            </div>
          )
        })}
      </div>
    )
  }
}

MultipleChoice.propTypes = {
  title: PropTypes.string,
  currentChoice: PropTypes.string,
  choices: PropTypes.array,
  onChange: PropTypes.func
}

class Background extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      age: '',
      gender: null,
      highestDegree: null
    }

    this.handleGender = this.handleGender.bind(this)
    this.handleHighestDegree = this.handleHighestDegree.bind(this)
    this.handleAge = this.handleAge.bind(this)

    this.addDemographics = this.addDemographics.bind(this)
  }

  addDemographics (e) {
    // Make sure there is no null demographic
    for (let key in this.state) {
      if (this.state[key] === null) {
        e.preventDefault()
      }
    }

    redis.demographics(this.state)
  }

  handleAge (e) {
    this.setState({
      age: e.currentTarget.value
    })
  }

  handleGender (e) {
    this.setState({
      gender: e.currentTarget.value
    })
  }

  handleHighestDegree (e) {
    this.setState({
      highestDegree: e.currentTarget.value
    })
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <input type='number' value={this.state.age} onChange={this.handleAge} />
        </div>
        <MultipleChoice title='Gender: '
          currentChoice={this.state.gender}
          onChange={this.handleGender}
          choices={[{value: 'female', label: 'Female'}, {value: 'male', label: 'Male'}, {value: 'other', label: 'Other/unsure'}]} />
        <div className='row'>
          <h5>Highest Degree Obtained: </h5>
          <input type='radio' value='highSchool' checked={this.state.highestDegree === 'highSchool'} onChange={this.handleHighestDegree} /><span>High School</span><br />
          <input type='radio' value='bachelors' checked={this.state.highestDegree === 'bachelors'} onChange={this.handleHighestDegree} /><span>Bachelors</span><br />
          <input type='radio' value='masters' checked={this.state.highestDegree === 'masters'} onChange={this.handleHighestDegree} /><span>Masters</span><br />
          <input type='radio' value='phd' checked={this.state.highestDegree === 'phd'} onChange={this.handleHighestDegree} /><span>PhD</span><br />
          <input type='radio' value='other' checked={this.state.highestDegree === 'other'} onChange={this.handleHighestDegree} /><span>Other</span><br />
        </div>
        <div className='row'>
          <h5><Link to='/info' onClick={this.addDemographics}>NEXT</Link></h5>
        </div>
      </div>
    )
  }
}

export default Background
