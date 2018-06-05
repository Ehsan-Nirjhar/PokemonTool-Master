import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import PokeTypes from '../data/types.json'

import redis from '../redis'
import Scatterplot from '../components/Scatterplot'
import Starplot from '../components/Starplot'
import BarChart from '../components/BarChart'

import questions from '../data/questions.json'

import { toggleFilter, updateFilter, clearFilter } from '../redux/actions'

// For randomization
var arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
var currentIndex = 15, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }


class GridView extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      xAxisValue: 'Attack',
      yAxisValue: 'Defense',
      selectedPokemon: null,
      response: '',
      qID: 0,
      highlightFilter: '',
      highlightAccessor: 'Types'
    }

    this.submitResponse = this.submitResponse.bind(this)
    this.responseChange = this.responseChange.bind(this)

    this.divMouseEnter = this.divMouseEnter.bind(this)

    this.xAxisChange = this.xAxisChange.bind(this)
    this.yAxisChange = this.yAxisChange.bind(this)
    this.xAxisMouseEnter = this.xAxisMouseEnter.bind(this)
    this.yAxisMouseEnter = this.yAxisMouseEnter.bind(this)

    this.setPokemon = this.setPokemon.bind(this)
    this.scatterMouseEnter = this.scatterMouseEnter.bind(this)

    this.starplotMouseEnter = this.starplotMouseEnter.bind(this)

    this.addTypeFilter = this.addTypeFilter.bind(this)
    this.typeMouseEnter = this.typeMouseEnter.bind(this)
    this.typeMouseLeave = this.typeMouseLeave.bind(this)

    this.addGenerationFilter = this.addGenerationFilter.bind(this)
    this.generationMouseEnter = this.generationMouseEnter.bind(this)
    this.generationMouseLeave = this.generationMouseLeave.bind(this)

    this.totalHeight = window.innerHeight
    this.barChartHeight = this.totalHeight * 0.28
    this.starplotHeight = this.totalHeight * 0.45
    this.questionHeight = this.totalHeight * 0.15

    this.scatterHeight = this.totalHeight * 0.83
  }

  submitResponse (e) {
    let response = this.state.response
    let qID = this.state.qID

    if (response !== '') {
      redis.add('Response', {
        date: +(new Date()),
        qID: qID,
        response: response
      })

      this.setState({
        qID: this.state.qID + 1,
        response: ''
      })
    }
  }

  // NOTE: not logging this interaction, not important
  responseChange (e) {
    this.setState({
      response: e.target.value
    })
  }

  divMouseEnter (e) {
    redis.add('MouseEnter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: e.currentTarget.id,
      target: 'null',
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters,
      qID: this.state.qID
    })
  }

  xAxisMouseEnter (e) {
    redis.add('MouseEnter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: 'xAxisSelection',
      target: 'xAxis-null',
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters,
      qID: this.state.qID
    })
  }

  yAxisMouseEnter (e) {
    redis.add('MouseEnter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: 'yAxisSelection',
      target: 'yAxis-null',
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters,
      qID: this.state.qID
    })
  }

  xAxisChange (e) {
    let value = e.target.value
    this.setState({ xAxisValue: value }, () => {
      redis.add('xAxisChanged', {
        date: +(new Date()),
        x: e.pageX,
        y: e.pageY,
        yAxis: this.state.yAxisValue,
        xAxis: this.state.xAxisValue,
        aoi: 'xAxisSelection',
        target: 'yAxis-' + value,
        selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
        filters: this.props.filters,
        qID: this.state.qID
      })
    })
  }

  yAxisChange (e) {
    let value = e.target.value
    this.setState({ yAxisValue: value }, () => {
      redis.add('yAxisChanged', {
        date: +(new Date()),
        x: e.pageX,
        y: e.pageY,
        yAxis: this.state.yAxisValue,
        xAxis: this.state.xAxisValue,
        aoi: 'yAxisSelection',
        target: 'yAxis-' + value,
        selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
        filters: this.props.filters,
        qID: this.state.qID
      })
    })
  }

  scatterMouseEnter (e, datum) {
    redis.add('MouseEnter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: 'Scatterplot',
      target: datum.id,
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters,
      qID: this.state.qID
    })
  }

  setPokemon (e, datum) {
    this.setState({
      selectedPokemon: datum
    }, () => {
      redis.add('PokemonSelected', {
        date: +(new Date()),
        x: e.pageX,
        y: e.pageY,
        yAxis: this.state.yAxisValue,
        xAxis: this.state.xAxisValue,
        aoi: 'Scatterplot',
        target: datum.id,
        selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
        filters: this.props.filters,
        qID: this.state.qID
      })
    })
  }

  starplotMouseEnter (e, datum) {
    console.log('star')
    redis.add('MouseEnter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: 'Starplot',
      target: datum.id,
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters,
      qID: this.state.qID
    })
  }

  addTypeFilter (e) {
    var filterObj = {
      Types: [e.target.value]
    }

    redis.add('AddedTypeFilter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: 'TypeFilters',
      target: e.target.value,
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters,
      qID: this.state.qID
    })

    this.props.toggleFilter(filterObj)
  }

  typeMouseEnter (e) {
    this.setState({
      highlightFilter: e.target.value,
      highlightAccessor: 'Types'
    })

    redis.add('MouseEnter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: 'TypeFilters',
      target: e.target.value,
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters,
      qID: this.state.qID
    })
  }

  typeMouseLeave (e) {
    this.setState({
      highlightFilter: '',
      highlightAccessor: ''
    })
  }

  addGenerationFilter (e, d, i) {
    var filterObj = {
      Generation: [i + 1 + '']
    }

    redis.add('AddedGenerationFilter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: 'BarChart',
      target: (i + 1),
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters,
      qID: this.state.qID
    })

    this.props.toggleFilter(filterObj)
  }

  generationMouseEnter (e, d, i) {
    this.setState({
      highlightFilter: i + 1,
      highlightAccessor: 'Generation'
    })

    redis.add('MouseEnter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: 'BarChart',
      target: (i + 1),
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters,
      qID: this.state.qID
    })
  }

  generationMouseLeave (e, d, i) {
    this.setState({
      highlightFilter: '',
      highlightAccessor: ''
    })
  }

  render () {
    return (
      <div>
        <div className='row'>
          <div className='four columns'>
            <div className='row'>
              <div id='BarChart' onMouseEnter={this.divMouseEnter}>
                <BarChart autoWidth tooltip height={this.barChartHeight}
                  data={this.props.pokemon}
                  selected={this.props.filters.Generation}
                  onClick={this.addGenerationFilter}
                  onMouseEnter={this.generationMouseEnter}
                  onMouseLeave={this.generationMouseLeave}
                  xAccessor={'Generation'}
                  yLabel='# of Pokemon'
                  xLabel='Generation' />
              </div>
            </div>
            <div className='row'>
              <div id='Starplot' onMouseEnter={this.divMouseEnter}>
                <Starplot autoWidth tooltip includeLabels includeGuidelines
                  height={this.starplotHeight}
                  onMouseEnter={this.starplotMouseEnter}
                  datum={this.state.selectedPokemon}
                  labels={Object.keys(this.props.scales)}
                  accessors={Object.keys(this.props.scales).map((k) => this.props.scales[k])} />
              </div>
            </div>
            <div className='row' id='QuestionArea' onMouseEnter={this.divMouseEnter}>
              {
                (this.state.qID !== questions.length)
                  ? (<div>
                    <span>{'Question ' + (this.state.qID + 1) + '/' + questions.length + ': ' + questions[arr[this.state.qID]]}</span><br />  
                    <textarea style={{width: '100%', height: this.questionHeight + 'px'}} value={this.state.response} onChange={this.responseChange} /><br />
                    <input type='submit' value='Submit' onClick={this.submitResponse} />
                  </div>) : (<span>Finished</span>)
              }
            </div>
          </div>
          <div className='eight columns'>
            <div id='Scatterplot' className='row' onMouseEnter={this.divMouseEnter}>
              <Scatterplot autoWidth tooltip height={this.scatterHeight}
                onClick={this.setPokemon}
                onMouseEnter={this.scatterMouseEnter}
                data={this.props.filteredPokemon}
                highlightFilter={this.state.highlightFilter}
                highlightAccessor={this.state.highlightAccessor}
                idAccessor='Name'
                xAccessor={this.state.xAxisValue}
                xDomain={this.props.scales[this.state.xAxisValue].domain()}
                xLabel={this.state.xAxisValue}
                yAccessor={this.state.yAxisValue}
                yDomain={this.props.scales[this.state.yAxisValue].domain()}
                yLabel={this.state.yAxisValue} />
            </div>
            <div className='row'>
              <div id='AxisSelection'>
                <div id='X_Axis_Selection' className='six columns' onMouseEnter={this.xAxisMouseEnter}>
                  <span>X Axis: </span>
                  <select id='xAxis_Selection' onChange={this.xAxisChange} value={this.state.xAxisValue}>
                    <option value='HP'>HP</option>
                    <option value='Attack'>Attack</option>
                    <option value='Defense'>Defense</option>
                    <option value='Special_Attack'>Special Attack</option>
                    <option value='Special_Defense'>Special Defense</option>
                    <option value='Speed'>Speed</option>
                  </select>
                </div>
                <div id='Y_Axis_Selection' className='six columns' onMouseEnter={this.yAxisMouseEnter}>
                  <span>Y Axis: </span>
                  <select id='yAxis_Selection' onChange={this.yAxisChange} value={this.state.yAxisValue}>
                    <option value='HP'>HP</option>
                    <option value='Attack'>Attack</option>
                    <option value='Defense'>Defense</option>
                    <option value='Special_Attack'>Special Attack</option>
                    <option value='Special_Defense'>Special Defense</option>
                    <option value='Speed'>Speed</option>
                  </select>
                </div>
              </div>
              <div id='TypeFilters' onMouseEnter={this.divMouseEnter}>
                {PokeTypes.map((type, i) => {
                  var toggled = 'off'
                  if (typeof this.props.filters['Types'] !== 'undefined') {
                    if (this.props.filters['Types'].includes(type)) {
                      toggled = 'on'
                    }
                  }
                  return <button key={i}
                    className={'button ' + type + ' ' + toggled}
                    onClick={this.addTypeFilter}
                    onMouseEnter={this.typeMouseEnter}
                    onMouseLeave={this.typeMouseLeave}
                    value={type}>{type}</button>
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

GridView.defaultProps = {
  toggleFilter: () => {},
  updateFilter: () => {},
  clearFilter: () => {},
  pokemon: [],
  filteredPokemon: [],
  scales: []
}

GridView.propTypes = {
  toggleFilter: PropTypes.func,
  updateFilter: PropTypes.func,
  clearFilter: PropTypes.func,
  pokemon: PropTypes.array,
  filteredPokemon: PropTypes.array,
  scales: PropTypes.any,
  filters: PropTypes.any
}

const mapStateToProps = (state) => {
  return {
    pokemon: state.list.pokemon,
    filteredPokemon: state.list.filteredPokemon,
    scales: state.list.scales,
    filters: state.list.filters
  }
}

const mapDispatchToProps = {
  toggleFilter,
  updateFilter,
  clearFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(GridView)
