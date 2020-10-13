// SVG drawing area
let margin = { top: 40, right: 10, bottom: 60, left: 60 };

let width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

let svg = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Scales
let x = d3
  .scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.1);

let y = d3.scaleLinear().range([height, 0]);

// Axis
let xAxis = d3.axisBottom().scale(x);
let xSvg = svg
  .append('g')
  .attr('class', 'x-axis axis')
  .attr('transform', 'translate(0,' + height + ')');
let yAxis = d3.axisLeft().scale(y);
let ySvg = svg.append('g').attr('class', 'y-axis axis');

// Sorting
let sort = true;

// Initialize data
loadData();

// Create a 'data' property under the window object
// to store the coffee chain data
Object.defineProperty(window, 'data', {
  // data getter
  get: function() {
    return _data;
  },
  // data setter
  set: function(value) {
    _data = value;
    // update the visualization each time the data property is set by using the equal sign (e.g. data = [])
    updateVisualization();
  }
});

// Load CSV file
function loadData() {
  d3.csv('data/coffee-house-chains.csv').then(csv => {
    csv.forEach(function(d) {
      d.revenue = +d.revenue;
      d.stores = +d.stores;
    });

    // Store csv data in global variable
    data = csv;

    // updateVisualization gets automatically called within the data = csv call;
    // basically(whenever the data is set to a value using = operator);
    // see the definition above: Object.defineProperty(window, 'data', { ...
  });
}

// Render visualization
function updateVisualization() {
  // update barchart with user selection
  let rankingType = d3.select('#ranking-type').property('value');

  // bonus activity sorting
  sort ? data.sort((a, b) => b[rankingType] - a[rankingType]) : data.sort((a, b) => a[rankingType] - b[rankingType])

  // update scales
  x.domain(data.map(d => d.company));
  y.domain([0, d3.max(data, d => d[rankingType])]);

  svg
    .select('.x-axis')
    .transition()
    .duration(1000)
    .call(xAxis);

  svg
    .select('.y-axis')
    .transition()
    .duration(1000)
    .call(yAxis);

  // barchart and transitions
  let barchart = svg.selectAll('rect').data(data);

  barchart
    .enter()
    .append('rect')
    .merge(barchart)
    .attr('class', 'bar')
    .transition()
    .duration(1000)
    .attr('x', d => x(d.company))
    .attr('y', d => y(d[rankingType]))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d[rankingType]))
    .attr('anchor', 'middle');

  	barchart.exit().remove()
}

d3.select("#change-sorting").on("click", function() {
  sort = !sort;
  updateVisualization();
});



