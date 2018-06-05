import React, { PropTypes } from 'react'
import * as d3 from 'd3'

import Tooltip from './Tooltip'

class Starplot extends React.Component {
  constructor (props) {
    super(props)

    this.createChart = this.createChart.bind(this)
    this.updateChart = this.updateChart.bind(this)
    this.removeChart = this.removeChart.bind(this)

    if (props.tooltip) {
      const tooltipFunction = (d) => {
        let tip = ''
        tip += d.Name + '</br>'
        tip += 'Generation: ' + d.Generation + '</br>'
        tip += 'Type: ' + d.Types.join(' ') + '</br>'
        tip += 'Attack: ' + d.Attack + '</br>'
        tip += 'Defense: ' + d.Defense + '</br>'
        tip += 'Special Attack: ' + d.Special_Attack + '</br>'
        tip += 'Special Defense: ' + d.Special_Defense + '</br>'
        tip += 'Speed: ' + d.Speed + '</br>'
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

    this.radius = (Math.min(this.chartWidth, this.chartHeight) / 2)
    this.origin = [this.radius, this.radius]
    this.radii = this.props.accessors.length
    this.radians = 2 * Math.PI / this.radii

    let svg = root.append('svg')
      .attr('width', this.chartWidth + this.props.margin.left + this.props.margin.right)
      .attr('height', this.chartHeight + this.props.margin.top + this.props.margin.bottom)
    this.chart = svg.append('g')
      .attr('transform', 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')')
    this.starContainer = this.chart.append('g')
      .attr('class', 'star')
    this.guidelines = this.chart.append('g')
      .attr('class', 'guidelines')
    this.labels = this.chart.append('g')
      .attr('class', 'labels')
    // Add header
    this.header = this.chart.append('text')
      .attr('class', 'star-header')
  }

  updateChart (props, state) {
    // Draw guidelines
    if (props.includeGuidelines) {
      this.guidelines.selectAll('.star-axis').remove()
      let r = 0
      props.accessors.forEach(() => {
        let l = this.radius
        let x = l * Math.cos(r)
        let y = l * Math.sin(r)
        this.guidelines.append('line')
          .attr('class', 'star-axis')
          .attr('x1', this.origin[0])
          .attr('y1', this.origin[1])
          .attr('x2', this.origin[0] + x)
          .attr('y2', this.origin[1] + y)
        r += this.radians
      })
    }

    // Draw labels
    if (props.includeLabels) {
      this.labels.selectAll('.star-label').remove()
      let r = 0
      props.accessors.forEach((d, i) => {
        let l = this.radius
        let x = (l + props.labelMargin) * Math.cos(r)
        let y = (l + props.labelMargin) * Math.sin(r)
        this.labels.append('text')
          .attr('class', 'star-label')
          .attr('x', this.origin[0] + x)
          .attr('y', this.origin[1] + y)
          .text(props.labels[i].replace('_', ' '))
          .style('text-anchor', 'middle')
          .style('dominant-baseline', 'central')
        r += this.radians
      })
    }

    let scale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, this.radius])

    // Draw star
    if (props.datum !== null) {
      this.starContainer.selectAll('*').remove()
      this.starContainer.append('circle')
        .attr('class', 'star-origin')
        .attr('cx', this.origin[0])
        .attr('cy', this.origin[1])
        .attr('r', 2)

      let path = d3.radialLine()

      let pathData = []
      let r = Math.PI / 2
      props.accessors.forEach((d, i) => {
        pathData.push([
          r,
          scale(d(props.datum[props.labels[i]]))
        ])
        r += this.radians
      })

      this.starContainer.append('path')
        .attr('class', 'star-path')
        .attr('transform', 'translate(' + this.origin[0] + ',' + this.origin[1] + ')')
        .attr('d', path(pathData) + 'Z')

      // Add icon
      this.starContainer.append('svg:image')
        .attr('class', 'star-icon')
        .attr('x', this.origin[0] - 100 / 2)
        .attr('y', this.origin[1] - 100 / 2)
        .attr('width', 100)
        .attr('height', 100)
        .attr('xlink:href', require('../data/sprites/' + props.datum['id'].split('.')[0] + 'MS.png'))
        .on('mouseenter', (d, i) => {
          this.props.onMouseEnter(d3.event, this.props.datum)
          if (props.tooltip) {
            this.tip.show(d3.event, this.props.datum)
          }
        })
        .on('mouseleave', (d, i) => {
          if (props.tooltip) {
            this.tip.hide(d3.event, this.props.datum)
          }
        })

      // Draw header
      this.header
        .attr('x', this.origin[0])
        .attr('y', -(props.margin.top / 2))
        .style('text-anchor', 'middle')
        .text(props.datum[props.header])
    }
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
    if (nextProps.datum !== this.props.datum) {
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

Starplot.defaultProps = {
  datum: {},
  margin: {
    top: 25,
    left: 60,
    bottom: 0,
    right: 60
  },
  autoWidth: false,
  width: 640,
  height: 360,
  labelMargin: 10,
  header: 'Name',
  accessors: [],
  labels: [],
  includeGuidelines: false,
  includeLabels: false,
  tooltip: false,
  onMouseEnter: () => {}
}

Starplot.propTypes = {
  datum: PropTypes.any,
  margin: PropTypes.object,
  autoWidth: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  includeGuidelines: PropTypes.bool,
  includeLabels: PropTypes.bool,
  labelMargin: PropTypes.number,
  header: PropTypes.string,
  accessors: PropTypes.array,
  labels: PropTypes.array,
  tooltip: PropTypes.bool,
  onMouseEnter: PropTypes.func
}

export default Starplot
