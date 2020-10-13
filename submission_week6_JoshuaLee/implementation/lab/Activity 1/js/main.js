// The function is called every time when an order comes in or an order gets processed
// The current order queue is stored in the variable 'orders'

let svg = d3
  .select('body')
  .append('svg')
  .attr('width', 600)
  .attr('height', 200);

let orderLength = svg
  .append('text')
  .attr('class', 'title')
  .attr('x', 600 / 2)
  .attr('y', 50)
  .attr('text-anchor', 'middle')
  .style('font-size', '40px')

function updateVisualization(orders) {
  console.log(orders);

  // Data-join (circle now contains the update selection)
  let circle = svg.selectAll('circle').data(orders);
  orderLength.text(`Orders: ${orders.length}`);

  // Enter (initialize the newly added elements)
  circle
    .enter()
    .append('circle')
    .attr('class', 'dot')

    // Enter and Update (set the dynamic properties of the elements)
    .merge(circle)
    .attr('r', 30)
    .attr('cx', (d, index) => index * 80 + 50)
	.attr('cy', 80)
	.attr('fill', d => d.product === "coffee" ? 'red' : 'blue');

  // Exit
  circle.exit().remove();
}
