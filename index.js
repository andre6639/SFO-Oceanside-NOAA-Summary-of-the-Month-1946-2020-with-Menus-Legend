import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  csv,
  scaleOrdinal,
  scaleLinear,
  scaleTime,
  max,
  format,
  timeFormat,
  tooltip,
  extent,
} from 'd3';
import ReactDropdown from 'react-dropdown';
import { useData } from './useData';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';
import { Dropdown } from './Dropdown';
import { ColorLegend } from './ColorLegend';

const width = 960;
const height = 500;
const margin = { top: 20, right: 200, bottom: 88, left: 110 };
const xAxisLabelOffset = 65;
const yAxisLabelOffset = 52;
const fadeOpacity = 0.5;

const attributes = [
  //  { value: 'AverageWindSpeed', label: 'Average Wind Speed' },
  //  { value: 'PeakGustWindSpeed', label: 'Peak Gust WindSpeed' },
  { value: 'AverageTemperature', label: 'Average Temperature' },
  { value: 'MaximumTemperature', label: 'Maximum Temperature' },
  { value: 'MinimumTemperature', label: 'Minimum Temperature' },
  //  { value: 'ExtremeMaximumTemperatureForThePeriod', label: 'Extreme Maximum Temperature' },
  {
    value: 'ExtremeMinimumTemperatureForThePeriod',
    label: 'Extreme Minimum Temperature',
  },
];

const getLabel = (value) => {
  for (let i = 0; i < attributes.length; i++) {
    if (attributes[i].value === value) {
      return attributes[i].label;
    }
  }
};

const App = () => {
  const data = useData();
  const [hoveredValue, setHoveredValue] = useState(null);
  console.log(hoveredValue);

  const initialYAttribute = 'AverageTemperature';
  const [yAttribute, setYAttribute] = useState(initialYAttribute);

  if (!data) {
    return <pre>Loading...</pre>;
  }

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const xValue = (d) => d.DATE;
  const xAxisLabel = '';
  const yValue = (d) => d[yAttribute];
  const yAxisLabel = getLabel(yAttribute)
  
  const colorValue = (d) => d.NAME;
  const colorLegendLabel = 'Station';
  
  const filteredData = data.filter((d) => hoveredValue === colorValue(d));
  
  const circleRadius = 7;
  
  const siFormat = format('.2s');
  const xAxisTickFormat = timeFormat('%Y');
  const yAxisTickFormat = format(' ');

  const legendSize = 15;
  
  console.log(data);

  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([innerHeight, 0])
    .nice();
  
  const colorScale = scaleOrdinal()
    .domain(data.map(colorValue))
    .range(['#E6842A', '#137B80']);

  
  return (
    <>
      <div className="menus-container">
        <ReactDropdown
          options={attributes}
          id="y-select"
          value={yAttribute}
          onChange={({ value }) => setYAttribute(value)}
        />
      </div>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <AxisBottom
            xScale={xScale}
            innerHeight={innerHeight}
            tickFormat={xAxisTickFormat}
            tickOffset={7}
          />
          <text
            className="axis-label"
            textAnchor="middle"
            transform={`translate(${-yAxisLabelOffset}, 
          ${innerHeight / 2}) rotate(-90)`}
          >
            {yAxisLabel}
          </text>
          <AxisLeft yScale={yScale} innerWidth={innerWidth} tickOffset={7} />
          <text
            className="axis-label"
            x={innerWidth / 2}
            y={innerHeight + xAxisLabelOffset}
            textAnchor="middle"
          >
            {xAxisLabel}
          </text>
          <g transform={`translate(${innerWidth + 40}, 60)`} font-size={legendSize}>
          <text x={35} y={-25} className="axis-label" textAnchor="middle">
            {colorLegendLabel}
          </text>
          <g>
            <ColorLegend
              tickSpacing={25}
              tickSize={10}
              tickTextOffset={20}
              tickSize={circleRadius}
              colorScale={colorScale}
              onHover={setHoveredValue}
              hoveredValue={hoveredValue}
              fadeOpacity={fadeOpacity}
            />
          </g>
          <ColorLegend
            tickSpacing={25}
            tickSize={10}
            tickTextOffset={20}
            tickSize={circleRadius}
            colorScale={colorScale}
            onHover={setHoveredValue}
          />
        </g>
        <g opacity={hoveredValue ? fadeOpacity : 1}>
          <Marks
            data={data}
            xScale={xScale}
            yScale={yScale}
            xValue={xValue}
            yValue={yValue}
            colorScale={colorScale}
            colorValue={colorValue}
            tooltipFormat={yAxisTickFormat}
            circleRadius={circleRadius}
          />
        </g>
          <Marks
            data={filteredData}
            xScale={xScale}
            yScale={yScale}
            xValue={xValue}
            yValue={yValue}
            colorScale={colorScale}
          	colorValue={colorValue}
            tooltipFormat={yAxisTickFormat}
            circleRadius={circleRadius}
          />
        </g>
      </svg>
    </>
  );
};
const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);

// for doing arcs
//(data).map((d, i) => (
//        <path fill={d['RGB hex value']} d={pieArc({
//              startAngle: i / data.length * 2 * Math.PI,
//  					  endAngle: (i+1) / data.length * 2 * Math.PI
//            })}/>
