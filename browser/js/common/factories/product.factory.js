app.factory('ProductFactory', function($http) {
  let Product = {};

  Product.getOne = function(productId) {
    return $http.get('/api/products/' + productId)
      .then(product => product.data)
  }

  Product.getAll = function() {
    return $http.get('/api/products/')
      .then(products => products.data)
  }

  Product.getAllOfType = function(type) {
    return $http.get('/api/products/type/' + type)
      .then(options => options.data)
      .then(options => {
        let baseModels = {};
        let upgrades = { ram: [], hdd: [], cpu: [], gpu: [] };
        options.forEach(option => {
          baseModels[option.BaseModels.name] = option.BaseModels;
          upgrades[option.Upgrades.type].push(option.Upgrades);
        })
      })
  }


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

  Product.findByFilter = function(filterObj) {

  }

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
