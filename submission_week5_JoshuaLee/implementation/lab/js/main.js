// SVG Size
let width = 700,
  height = 500,
  padding = 40;

// Load CSV file
d3.csv('data/wealth-health-2014.csv', row => {
  row.LifeExpectancy = +row.LifeExpectancy;
  row.Income = +row.Income;
  row.Population = +row.Population;
  return row;
}).then(data => {
  // Analyze the dataset in the web console
  console.log(data);
  console.log('Countries: ' + data.length);
  data.sort((a, b) => {
    return b.Population - a.Population;
  });
  appendGraph(data);
});

const appendGraph = data => {
  console.log('DATA: ', data);
  let svg = d3
    .select('#chart-area')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // Returns the maximum value in a given array
  let incomeMax = d3.max(data, d => d.Income);
  let incomeMin = d3.min(data, d => d.Income);
  let lifeExpectancyMax = d3.max(data, d => d.LifeExpectancy);
  let lifeExpectancyMin = d3.min(data, d => d.LifeExpectancy);
  let populationScaleMax = d3.max(data, d => d.Population);
  let populationScaleMin = d3.min(data, d => d.Population);

  console.log('income max: ', incomeMax, width);
  console.log('life expectancy max: ', lifeExpectancyMax, height);

  let incomeScale = d3
    .scaleLog()
    .domain([incomeMin - 100, incomeMax + 100])
    .range([padding, width - padding]);
  let lifeExpectancyScale = d3
    .scaleLinear()
    .domain([lifeExpectancyMin, lifeExpectancyMax])
    .range([height - padding, padding]);
  let populationScale = d3
    .scaleLinear()
    .domain([populationScaleMin, populationScaleMax])
    .range([4, 30]);

  let colorPalette = d3.scaleOrdinal(d3.schemeCategory10);

  colorPalette.domain([
    'Sub-Saharan Africa',
    'East Asia & Pacific',
    'Middle East & North Africa',
    'America',
    'South Asia',
    'Europe & Central Asia'
  ]);

  svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => incomeScale(d.Income))
    .attr('cy', d => lifeExpectancyScale(d.LifeExpectancy))
    .attr('r', d => populationScale(d.Population))
    .attr('fill', d => colorPalette(d.Region))
    .attr('stroke', 'black');

  let xAxis = d3
    .axisBottom()
    .scale(incomeScale)
    .tickFormat(d3.format(1.))
    .ticks(7)
    .tickValues([1000, 2000, 4000, 8000, 16000, 32000, 100000]);
  let yAxis = d3
    .axisLeft()
    .scale(lifeExpectancyScale)
    .ticks(5);

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + (height - padding) + ')')
    .call(xAxis)
    .append('text')
    .text('Income per Person (GDP per Capita)')
    .attr('fill', 'black')
    .attr('transform', 'translate(' + width / 2 + ' ,' + 30 + ')');

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .attr('transform', 'translate(' + padding + ', 0)')
    .call(yAxis)
    .append('text')
    .text('Life Expectancy')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - padding / 2)
    .attr('x', 0 - height / 2 + 25)
    .attr('fill', 'black');
};
