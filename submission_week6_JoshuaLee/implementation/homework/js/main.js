// SVG drawing area
let margin = { top: 40, right: 40, bottom: 60, left: 60 };

let width = 600 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

let svg = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Date parser
let formatDate = d3.timeFormat('%Y');
let parseDate = d3.timeParse('%Y');

// Scales
let x = d3.scaleTime().rangeRound([0, width]);
let y = d3.scaleLinear().range([height, 0]);

// Initialize data
loadData();

// FIFA world cup
let data;

// Load CSV file
function loadData() {
  d3.csv('data/fifa-world-cup.csv').then(function(csv) {
    csv.forEach(function(d) {
      // Convert string to 'date object'
      d.YEAR = parseDate(d.YEAR);

      // Convert numeric values to 'numbers'
      d.TEAMS = +d.TEAMS;
      d.MATCHES = +d.MATCHES;
      d.GOALS = +d.GOALS;
      d.AVERAGE_GOALS = +d.AVERAGE_GOALS;
      d.AVERAGE_ATTENDANCE = +d.AVERAGE_ATTENDANCE;
    });

    // Store csv data in global variable
    data = csv;

    // Axis and path
    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0, ${height})`);
    svg.append('g').attr('class', 'axis y-axis');
    svg.append('path').attr('class', 'line');

    // Draw the visualization for the first time
    updateVisualization();
  });
}

// For user data and to initiate user based change
let changeInterval = false;
d3.select('#chart-data').on('change', updateVisualization);
d3.select('#change-time').on('click', function() {
  changeInterval = true;
  updateVisualization();
});

// Initialize tooltip
let tooltip;
let tooltipTitle = '';
let tooltipText = '';
let selected = 'goals';

// Render visualization
function updateVisualization() {
  document.getElementById('details').style.display = 'none';

  // Obtain user inputted data attribute and time range
  selected = d3.select('#chart-data').property('value');
  console.log('selected: ', selected);
  let startTime = d3.select('#start-year').property('value');
  let endTime = d3.select('#end-year').property('value');

  changeInterval
    ? (filteredData = data.filter(
        d => formatDate(d.YEAR) >= startTime && formatDate(d.YEAR) <= endTime
      ))
    : (filteredData = data);

  // Axis and line
  x.domain(d3.extent(filteredData, d => d.YEAR));
  y.domain([0, d3.max(data, d => d[selected])]);
  svg
    .select('.x-axis')
    .transition()
    .duration(650)
    .call(d3.axisBottom(x));
  svg
    .select('.y-axis')
    .transition()
    .duration(650)
    .call(d3.axisLeft(y));

  let line = d3
    .line()
    .x(d => x(d.YEAR))
    .y(d => y(d[selected]))
    .curve(d3.curveLinear);
  svg
    .select('.line')
    .datum(filteredData)
    .transition()
    .duration(650)
    .attr('d', line);

  // Removes tooltip when not hovering
  const hideTooltip = () => {
    tooltip.remove();
    tooltipTitle.remove();
    tooltipText.remove();
  }

  // Update points
  let points = svg.selectAll('.point').data(filteredData);
  points
    .enter()
    .append('circle')
    .attr('class', 'point')
    .attr('fill', '#1DA1F2')
    .on('click', (event, d) => showEdition(d))
    .on('mouseover', (event, d) => updateTooltip(event, d))
    .on('mouseout', hideTooltip)
    .merge(points)
    .transition()
    .duration(650)
    .attr('cx', d => x(d.YEAR))
    .attr('cy', d => y(d[selected]))
    .attr('r', 4);

  points.exit().remove();
}

// Show side chart with user filtered data
function showEdition(d) {
  document.getElementById('details').style.display = 'block';
  document.getElementById('title').innerHTML = d.EDITION;
  document.getElementById('winner').innerHTML = d.WINNER;
  document.getElementById('goals').innerHTML = d.GOALS;
  document.getElementById('average').innerHTML = d.AVERAGE_GOALS;
  document.getElementById('matches').innerHTML = d.MATCHES;
  document.getElementById('teams').innerHTML = d.TEAMS;
  document.getElementById('attendance').innerHTML = d.AVERAGE_ATTENDANCE;
}

// Defines and updates tooltip
function updateTooltip(event, d) {
  tooltip = svg
    .append('rect')
    .attr('class', 'd3-tip')
    .attr('fill', '#E1E8ED')
    .attr('width', 270)
    .attr('height', 50)
    .attr('x', x(d.YEAR) > width * 0.5 ? x(d.YEAR) - 270 : x(d.YEAR))
    .attr(
      'y',
      y(d[selected]) > height - 50 ? y(d[selected]) - 50 : y(d[selected]) + 40
    );

  tooltipTitle = svg
    .append('text')
    .attr('class', 'tooltip-title')
    .text(d.EDITION)
    .attr('x', x(d.YEAR) > width * 0.5 ? x(d.YEAR) - 270 : x(d.YEAR))
    .attr(
      'y',
      y(d[selected]) > height - 50 ? y(d[selected]) - 50 : y(d[selected]) + 55
    )
    .attr('dx', 5)
    .attr('dy', 5);

  tooltipText = svg
    .append('text')
    .attr('class', 'tooltip-text')
    .text(selected + `: ${d[selected]}`)
    .attr('x', x(d.YEAR) > width * 0.5 ? x(d.YEAR) - 270 : x(d.YEAR))
    .attr(
      'y',
      y(d[selected]) > height - 50 ? y(d[selected]) - 50 : y(d[selected]) + 60
    )
    .attr('dx', 5)
    .attr('dy', 20);
}
