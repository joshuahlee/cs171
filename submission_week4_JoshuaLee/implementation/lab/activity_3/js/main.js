let filteredData = [];

d3.csv('data/cities.csv', row => {
  row.population = +row.population;
  row.x = +row.x;
  row.y = +row.y;
  return row;
}).then(data => {
  filteredData = data.filter(row => row.eu === 'true');
  appendText();
});

const appendText = () => {
  d3.select('body').append('p').text(
    `The number of elements in the filtered dataset is: ${filteredData.length}`
  );

  let svg = d3
    .select('body')
    .append('svg')
    .attr('width', 700)
    .attr('height', 550);

  svg
    .selectAll('circle')
    .data(filteredData)
    .enter()
    .append('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => (d.population < 1000000 ? 4 : 8))
    .attr('fill', 'green')
    .on('click', function(event, d) {
      console.log(`The population of ${d.city} is ${d.population}`);
    });

  svg
    .selectAll('text')
    .data(filteredData)
    .enter()
    .append('text')
    .attr('x', d => d.x)
    .attr('y', d => d.y - 13)
    .text(d => d.city)
    .attr('opacity', d => (d.population > 1000000 ? 1 : 0))
    .attr('class', 'city-label');
};
