import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import uniq from 'lodash.uniq'

import Tooltip from './Tooltip'

// Not very robust
// Quickly done to just support categorical x axis
class BarChart extends React.Component {
  constructor (props) {
    super(props)

    this.createChart = this.createChart.bind(this)
    this.updateChart = this.updateChart.bind(this)
    this.removeChart = this.removeChart.bind(this)

    if (props.tooltip) {
      const tooltipFunction = (d) => {
        let tip = d.length + ' Pokemon'
        return tip
      }

      this.tip = new Tooltip()
        .attr('className', 'tooltip')
        .offset([-8, 0])
        .html(tooltipFunction)
    }
  }

  createChart () {
    let root = d3.select(this.refs.root)

    // Get real chart width/height
    let width = this.props.width
    let height = this.props.height
    if (this.props.autoWidth) {
      width = root.node().offsetWidth
    }

    this.chartWidth = width - this.props.margin.left - this.props.margin.right
    this.chartHeight = height - this.props.margin.top - this.props.margin.bottom

    let svg = root.append('svg')
      .attr('width', this.chartWidth + this.props.margin.left + this.props.margin.right)
      .attr('height', this.chartHeight + this.props.margin.top + this.props.margin.bottom)
    this.chart = svg.append('g')
      .attr('transform', 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')')
    this.barContainer = this.chart.append('g')
      .attr('class', 'bars')

    // Axes groups
    this.xAxis = this.chart.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + this.chartHeight + ')')
    this.yAxis = this.chart.append('g')
      .attr('class', 'axis y-axis')

    // Add labels
    this.yLabel = this.chart.append('text')
      .attr('class', 'axis label')
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('x', -(this.chartHeight / 2))
      .attr('y', -this.props.margin.left + 6)
      .attr('dy', '.35em')
      .text(this.props.yLabel)
    this.xLabel = this.chart.append('text')
      .attr('x', this.chartWidth / 2)
      .attr('y', this.chartHeight + this.props.margin.bottom)
      .attr('text-anchor', 'middle')
      .text(this.props.xLabel)
  }

  updateChart (props, state) {
    var keys = uniq(props.data.map((d) => d[props.xAccessor])).sort()
    this.xScale = d3.scaleBand()
      .domain(keys)
      .rangeRound([0, this.chartWidth])

    var bins = []
    for (let i = 0; i < 6; i++) {
      bins.push([])
    }
    for (let i = 0; i < props.data.length; i++) {
      let key = props.data[i][props.xAccessor]
      bins[keys.indexOf(key)].push(props.data[i])
    }
    for (let i = 0; i < bins.length; i++) {
      if (props.selected.length !== 0) {
        if (props.selected.indexOf(i + 1 + '') > -1) {
          bins[i].selected = true
        } else {
          bins[i].selected = false
        }
      } else {
        bins[i].selected = true
      }
    }

    this.yScale = d3.scaleLinear()
     // .domain([0, d3.max(bins, (d) => d.length)])
	  .domain([0, 180])
      .rangeRound([this.chartHeight, 0])

    let bars = this.barContainer.selectAll('.bar')
      .data(bins, (d, i) => {
        return i + '-' + d.selected
      })

    bars.exit().remove()

    bars.enter()
      .append('rect')
        .attr('class', (d) => {
          return (d.selected) ? 'bar selected' : 'bar unselected'
        })
        .on('click', (d, i) => {
          this.props.onClick(d3.event, d, i)
        })
        .on('mouseenter', (d, i) => {
          this.props.onMouseEnter(d3.event, d, i)
          if (props.tooltip) {
            this.tip.show(d3.event, d)
          }
        })
        .on('mouseleave', (d, i) => {
          this.props.onMouseLeave(d3.event, d, i)
          if (props.tooltip) {
            this.tip.hide(d3.event, d)
          }
        })
        .attr('x', (d, i) => this.xScale(keys[i]))
        .attr('y', (d) => this.yScale(d.length))
        .attr('width', this.xScale.bandwidth())
        .attr('height', (d) => this.chartHeight - this.yScale(d.length))
      .merge(bars).transition().duration(400).ease(d3.easeLinear)
        .attr('x', (d, i) => this.xScale(keys[i]))
        .attr('y', (d) => this.yScale(d.length))
        .attr('width', this.xScale.bandwidth())
        .attr('height', (d) => this.chartHeight - this.yScale(d.length))

    // Update axes
    let xAxis = d3.axisBottom(this.xScale)

    this.xAxis.call(xAxis)
    this.yAxis.call(d3.axisLeft(this.yScale))

    // Update labels
    this.yLabel.text(props.yLabel)
    this.xLabel.text(props.xLabel)
  }

  removeChart () {
    let root = d3.select(this.refs.root)
    root.selectAll('*').remove()
  }

  componentDidMount () {
    this.createChart()
    this.updateChart(this.props, this.state)
  }

  componentWillUnmount () {
    this.removeChart()
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.data !== this.props.data || this.props.selected !== nextProps.selected) {
      this.updateChart(nextProps, nextState)
    }
    return false
  }

  render () {
    return (
      <div ref='root' />
    )
  }
}

BarChart.defaultProps = {
  data: [],
  margin: {
    top: 10,
    left: 55,
    bottom: 50,
    right: 45
  },
  autoWidth: false,
  width: 640,
  height: 220,
  onClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  xLabel: '',
  yLabel: '',
  xAccessor: 'key',
  tooltip: false,
  selected: []
}

BarChart.propTypes = {
  data: PropTypes.array,
  margin: PropTypes.object,
  autoWidth: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  xAccessor: PropTypes.string,
  tooltip: PropTypes.bool,
  selected: PropTypes.array
}

export default BarChart
