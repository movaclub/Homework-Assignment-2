// hardcoded menu items

const menu = {};

menu.salads = {
  'green': {
    'desc': 'A Healthy Green Salad',
    'price': 1.1
  },
  'greek': {
    'desc': 'A Well-Known Salad',
    'price': 1.5
  }
};

menu.course = {
  'soup': {
    'desc': 'Polish Milk Soup',
    'price': 1.0
  },
  'borsch': {
    'desc': 'Famous Ukrainian Borsch',
    'price': 2.0
  }
}

menu.drinks = {
  'water': {
    'desc': 'Mineral Water',
    'price': .55
  },
  'tea': {
    'desc': 'Pekoe Tea',
    'price': .44
  }
}

// export menu
module.exports = menu;