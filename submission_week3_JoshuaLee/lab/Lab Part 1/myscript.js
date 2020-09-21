let amusementRides = [
  {
    id: '1',
    name: 'Roller Coaster',
    price: 10,
    open: ['Mon', 'Tues', 'Wed', 'Fri'],
    limited: 'yes'
  },
  {
    id: '2',
    name: 'Cars',
    price: 15,
    open: ['Wed', 'Thur', 'Fri', 'Sat'],
    limited: 'no'
  },
  {
    id: '3',
    name: 'House',
    price: 5,
    open: ['Mon', 'Tues', 'Wed', 'Fri'],
    limited: 'no'
  }
];

const doublePrices = rides => {
  rides.forEach(ride => {
    if (ride.id === '2') {
      ride.price = ride.price;
    } else {
      ride.price = 2 * ride.price;
    }
  });
};

const debugAmusementRides = rides => {
  rides.forEach(ride => {
    let name = ride.name;
    let newPrice = ride.price;
    console.log(`${name}: ${newPrice}`)
  })
};

doublePrices(amusementRides);
debugAmusementRides(amusementRides);


