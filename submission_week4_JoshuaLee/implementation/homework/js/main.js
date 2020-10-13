let filteredData = [];

d3.csv('data/buildings.csv', row => {
  row.height_m = +row.height_m;
  row.height_ft = +row.height_ft;
  row.height_px = +row.height_px;
  return row;
}).then(data => {
  filteredData = data.sort((a, b) => {
    return b.height_m - a.height_m;
  });
  appendText();
});

const onClickHandler = d => {
  document.getElementById('specific-picture').innerHTML = `
    <img src='img/${d.image}' height='300px' width='200px'/>
  `;
  document.getElementById('specific-building').innerHTML = `
    <h4>${d.building}</h4>
  `;
  document.getElementById('specific-height').innerHTML = `
    Height: ${d.height_m}m
  `;
  document.getElementById('specific-location').innerHTML = `
    Location: ${d.city}, ${d.country}
  `;  
  document.getElementById('specific-floors').innerHTML = `
    Floors: ${d.floors}
  `;
  document.getElementById('specific-completed').innerHTML = `
    Completed in: ${d.completed}
  `;  
};

const appendText = () => {
  let svg = d3
    .select('.graphic')
    .append('svg')
    .attr('width', 500)
    .attr('height', 500);

  svg
    .selectAll('rect')
    .data(filteredData)
    .enter()
    .append('rect')
    .attr('width', d => d.height_px)
    .attr('height', 20)
    .attr('x', 210)
    .attr('y', (d, i) => (i * 500) / filteredData.length + 15)
    .attr('fill', '#1DA1F2')
    .on('click', (event, d) => {
      onClickHandler(d);
    });

  svg
    .selectAll('text.building-label')
    .data(filteredData)
    .enter()
    .append('text')
    .text(d => d.building)
    .attr('text-anchor', 'end')
    .attr('x', 200)
    .attr('y', (d, i) => (i * 500) / filteredData.length + 30)
    .attr('class', 'building-label');

  svg
    .selectAll('text.height-label')
    .data(filteredData)
    .enter()
    .append('text')
    .text(d => d.height_m + ' m')
    .attr('text-anchor', 'end')
    .attr('x', (d, i) => d.height_px + 200)
    .attr('y', (d, i) => (i * 500) / filteredData.length + 30)
    .attr('class', 'height-label');

  d3.select('.graphic')
    .append('p')
    .text('Building height specified in meters (m)');
};
