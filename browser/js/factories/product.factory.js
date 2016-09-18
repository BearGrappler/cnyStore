app.factory('ProductFactory', function($http) {
  let Product = {};

  //gets a single product by ID
  Product.getOne = function(productId) {
    return $http.get('/api/products/' + productId)
      .then(product => product.data)
  }

  //gets all products
  Product.getAll = function() {
    return $http.get('/api/products/')
      .then(products => products.data)
  }

  //NEED TO FIX
  //gets all base models of a given userType
  Product.getAllOfType = function(type) {
    return $http.get('/api/products?type=' + type)
      .then(options => options.data)
      .then(options => {
        let baseModels = new Set()
        let upgrades = { ram: [], hdd: [], cpu: [], gpu: [] };
        options.forEach(option => {
          baseModels.add(options.baseModels)
        })
        return baseModels
      })
      .then(options => {console.log('OPTIONS:', options); return options})
  }

  //extracts the upgrades from the http response and puts them on the product
  Product.getUpgrades = function(product) {
    return $http.get('/api/products/' + product.id + '/upgrades')
      .then(upgrades => upgrades.data)
      .then(upgrades => {
        product.ram = [];
        product.cpu = [];
        product.hdd = [];
        product.gpu = [];
        upgrades.forEach(upgrade => {
          upgrade = upgrade.Upgrades;
          if (upgrade.type === 'ram') {
            product.ram.push(upgrade)
          } else if (upgrade.type === 'cpu') {
            product.cpu.push(upgrade)
          } else if (upgrade.type === 'hdd') {
            product.hdd.push(upgrade)
          } else if (upgrade.type === 'gpu') {
            product.gpu.push(upgrade)
          }
        })
      })
      .then(function() {
        return product
      })
  }

  //this will take care of standard filter objs from the question waterfull
  // Product.findByFilterObj = function(filterObj) {

  // }

  //this will take care of search queries from the search bar
  Product.findBySearchFilter = function(term) {
    return $http.get('/api/products?search=' + term)
    .then(products => products.data)
    .catch(console.log)
  }

  //this will refresh the visible products from the sidebar filter
  Product.filter = function(filterObj, allProducts) {
    let newProducts = [];
    if (filterObj.manufacturer.size > 0) {
      filterObj.manufacturer.forEach(manufacturer => {
        allProducts.forEach(product => {
          if (product.manufacturer === manufacturer) newProducts.push(product)
        })
      })
    } else {
      newProducts = allProducts;
    }
    if (filterObj.price) {
      newProducts = newProducts.filter(product => product.price <= filterObj.price)
    }
    return newProducts;
  }

  return Product
})
