// DATASETS

// Global variable with 1198 pizza deliveries
// console.log(deliveryData);

// Global variable with 200 customer feedbacks
// console.log(feedbackData.length);

// FILTER DATA, THEN DISPLAY SUMMARY OF DATA & BAR CHART

function createVisualization(filteredDeliveryData, filteredFeedbackData) {
  // initialize desired variables
  let numPizzaDel = 0;
  let numAllPizzas = 0;
  let avgDeliveryTime = 0;
  let totalSales = 0;
  let numFeedback = 0;
  let numLow = 0;
  let numMed = 0;
  let numHigh = 0;

  // iterate through deliveryData for desired metrics
  filteredDeliveryData.forEach(item => {
    numAllPizzas += item.count;
    avgDeliveryTime += item.delivery_time;
    totalSales += item.price;
    numPizzaDel++;
  });
  avgDeliveryTime = Math.trunc((avgDeliveryTime /= numPizzaDel));

  // iterate through feedbackData for desired metrics
  filteredFeedbackData.forEach(item => {
    item.quality === 'high'
      ? numHigh++
      : item.quality === 'medium'
      ? numMed++
      : item.quality === 'low'
      ? numLow++
      : (numLow += 0);
    numFeedback++;
  });

  document.getElementById('summary-data').innerHTML = `
    <h4> Summary Data </h4>
    Number of Pizza Deliveries: ${numPizzaDel} </br>
    Number of All Delivered Pizzas: ${numAllPizzas} </br>
    Average Delivery Time: ${avgDeliveryTime} minutes </br>
    Total Sales in USD: $${Math.trunc(totalSales)} </br>
    Number of All Feedback Entries: ${numFeedback} </br>
    Number of Low Feedback: ${numLow} </br>
    Number of Medium Feedback: ${numMed} </br>
    Number of High Feedback: ${numHigh}`;

  renderBarChart(filteredDeliveryData);
}

const filterData = () => {
  let filteredDeliveryData = deliveryData;

  // filter location
  let selectLocation = document.getElementById('location-category');
  let selectedLocValue =
    selectLocation.options[selectLocation.selectedIndex].value;

  if (selectedLocValue !== 'all') {
    filteredDeliveryData = deliveryData.filter(
      order => order['area'] === selectedLocValue
    );
  }

  // filter mode of order
  let selectMode = document.getElementById('mode-category');
  let selectedModeValue = selectMode.options[selectMode.selectedIndex].value;

  if (selectedModeValue !== 'all') {
    filteredDeliveryData = filteredDeliveryData.filter(order =>
      order['order_type'] === selectedModeValue
    );
  }

  let filteredFeedbackData = feedbackData.filter(item => filteredDeliveryData.find(({ delivery_id }) => item.delivery_id === delivery_id));

  createVisualization(filteredDeliveryData, filteredFeedbackData);
};

filterData();
