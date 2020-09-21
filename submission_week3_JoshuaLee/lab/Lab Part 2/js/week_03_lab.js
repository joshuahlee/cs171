// Global variable with 60 attractions (JSON format)
// console.log(attractionData);

// responsible for calling render barchart with top 5 of the category
function dataFiltering(attractions) {
  let dataFiltered = attractions
    .sort((a, b) => b.Visitors - a.Visitors)
    .slice(0, 5);
  renderBarChart(dataFiltered);
}

// which dataset to give to dataFiltering to render on DOM
const dataManipulation = () => {
  let attractions = attractionData;
  let selectBox = document.getElementById('attraction-category');
  let selectedValue = selectBox.options[selectBox.selectedIndex].value;

  if (selectedValue === 'all') {
    dataFiltering(attractions);
  } else {
    let data = attractions.filter(
      attraction => attraction['Category'] === selectedValue
    );
    dataFiltering(data);
  }
};

dataManipulation();
