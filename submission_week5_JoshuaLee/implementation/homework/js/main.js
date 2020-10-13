// globals and helper functions
let filteredData = [];
const margin = 100;
const width = 600;
const height = 600;

// getting and filtering data
d3.csv('data/zaatari-refugee-camp-population (1).csv', row => {
  row.population = +row.population;
  let parseTime = d3.timeParse('%Y-%m-%d');
  row.date = parseTime(row.date);
  return row;
}).then(data => {
  filteredData = data;
  appendGraph(data);
});

// area graph
const appendGraph = data => {
  // creating canvas
  let svg = d3
    .select('.graphic')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // creating axis
  let dateScale = d3
    .scaleTime()
    .domain([d3.min(data, d => d.date), d3.max(data, d => d.date)])
    .range([margin, width - margin]);
  let populationScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.population)])
    .range([height - margin, margin]);

  let xAxis = d3.axisBottom().scale(dateScale);
  let yAxis = d3.axisLeft().scale(populationScale);

  let axisFormatter = d3.timeFormat('%b %Y');
  let hoverFormatter = d3.timeFormat('%Y-%m-%d');

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + (height - margin) + ')')
    .call(xAxis.tickFormat(d => axisFormatter(d)))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-1em')
    .attr('dy', '.2em')
    .attr('transform', 'rotate(-45)');

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .attr('transform', 'translate(' + margin + ',0)')
    .call(yAxis);

  // creating area graph with 2 regions
  svg
    .append('path')
    .datum(data)
    .attr(
      'd',
      d3
        .area()
        .x(d => dateScale(d.date))
        .y0(height - margin)
        .y1(d => populationScale(d.population))
    )
    .style('fill', 'url(#gradient)');

  let offset = populationScale(100000) / height;

  let areaChartFill = svg
    .append('linearGradient')
    .attr('id', 'gradient')
    .attr('x1', '0%')
    .attr('x2', '0%')
    .attr('y1', '0%')
    .attr('y2', '100%');

  // lower half
  areaChartFill
    .append('stop')
    .attr('offset', offset)
    .style('stop-color', '#1DA1F2')
    .style('stop-opacity', 1);

  // upper half
  areaChartFill
    .append('stop')
    .attr('offset', offset)
    .style('stop-color', '#657786')
    .style('stop-opacity', 1);

  // horizontal line
  svg
    .append('line')
    .attr('class', 'y')
    .style('stroke', '#1DA1F2')
    .style('stroke-dasharray', '1, 1')
    .attr('x1', margin)
    .attr('x2', height - margin + 25)
    .attr('y1', populationScale(100000))
    .attr('y2', populationScale(100000));

  // graph title
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', 0 + margin / 2)
    .attr('text-anchor', 'middle')
    .style('font-size', '15px')
    .style('text-decoration', 'underline')
    .text('Refugee Camp Population over Time');

  // area chart tooltip
  let bisectDate = d3.bisector(d => d.date).left;

  let focus = svg.append('g').style('display', 'none');

  focus
    .append('line')
    .attr('class', 'x')
    .style('stroke', '#14171A')
    .attr('y1', margin)
    .attr('y2', height - margin);

  focus
    .append('text')
    .attr('class', 'population')
    .attr('dx', -3)
    .attr('dy', '-2.5em');

  focus
    .append('text')
    .attr('class', 'date')
    .attr('dx', -3)
    .attr('dy', '-2.3em');

  const mousemove = event => {
    let x0 = dateScale.invert(d3.pointer(event)[0]),
      i = bisectDate(data, x0, 1),
      d = data[i];

    focus
      .select('line.x')
      .attr('transform', 'translate(' + dateScale(d.date) + ',0)');

    focus
      .select('text.population')
      .attr(
        'transform',
        'translate(' + dateScale(d.date) + ', ' + (margin + 15) + ')'
      )
      .text(`Population: ${d.population}`);

    focus
      .select('text.date')
      .attr(
        'transform',
        'translate(' + dateScale(d.date) + ',' + (margin + 30) + ')'
      )
      .text(`Date: ${hoverFormatter(d.date)}`);
  };

  svg
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .on('mouseover', () => focus.style('display', null))
    .on('mouseout', () => focus.style('display', 'none'))
    .on('mousemove', mousemove);
};

// bar chart
var shelters = [
  { shelterType: 'Caravans', percentage: '79.68' },
  { shelterType: 'Combination', percentage: '10.81' },
  { shelterType: 'Tents', percentage: '9.51' }
];

let barChart = d3
  .select('.bar-chart')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// bar chart axis
let xScale = d3
  .scaleBand()
  .domain(shelters.map(d => d.shelterType))
  .rangeRound([margin, width - margin])
  .paddingInner(0.1);

let yScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([height - margin, margin]);

let xAxis = d3.axisBottom().scale(xScale);
let yAxis = d3.axisLeft().scale(yScale);

barChart
  .append('g')
  .attr('class', 'axis x-axis')
  .attr('transform', 'translate(0,' + (height - margin) + ')')
  .call(xAxis);

barChart
  .append('text')
  .enter()
  .selectAll('text')
  .style('text-anchor', 'middle')
  .attr('dx', '-.8em')
  .attr('dy', '.15em')
  .attr('x', d => xScale(d.shelterType))
  .attr('y', height);

barChart
  .append('g')
  .attr('class', 'axis y-axis')
  .attr('transform', 'translate(' + margin + ',0)')
  .call(yAxis.tickFormat(d => parseFloat(d) + '%'));

// bars
let bars = barChart
  .selectAll('rect')
  .data(shelters)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('x', d => xScale(d.shelterType) + 10)
  .attr('y', d => yScale(d.percentage))
  .attr('height', d => height - yScale(d.percentage) - margin)
  .attr('width', xScale.bandwidth() - 20)
  .attr('anchor', 'middle')
  .attr('fill', '#1DA1F2')

barChart
  .selectAll('.bar-text')
  .data(shelters)
  .enter()
  .append('text')
  .attr('class', 'bar-text')
  .attr('x', d => xScale(d.shelterType) + (xScale.bandwidth()/2) - 20)
  .attr('y', d => yScale(d.percentage) - 5)
  .text(d => parseFloat(d.percentage) + '%');

// bar chart title
barChart
  .append('text')
  .attr('class', 'title')
  .attr('x', width / 2)
  .attr('y', (3 * margin) / 4)
  .attr('text-anchor', 'middle')
  .style('text-decoration', 'underline')
  .style('font-size', '15px')
  .text('Type of Shelter');
