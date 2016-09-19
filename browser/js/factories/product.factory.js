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

  Product.updateProduct = function(product, updateObj) {
    return $http.put('/api/products/' + product.id, updateObj)
    .then(updatedProduct => updatedProduct.data)
  }

  Product.getRecommendedConfig = function(configObj, product) {
    let recommendedConfig = {};
    recommendedConfig.cpu = product.cpu[Math.round(configObj.cpu / 10) * product.cpu.length];
    recommendedConfig.ram = product.ram[Math.round(configObj.ram / 10) * product.ram.length];
    recommendedConfig.hdd = product.hdd[Math.round(configObj.hdd / 10) * product.hdd.length];
    recommendedConfig.gpu = product.gpu[Math.round(configObj.gpu / 10) * product.gpu.length];

    return recommendedConfig;
  }

  //this will take care of search queries from the search bar
  Product.findBySearchFilter = function(term) {
    return $http.get('/api/products?search=' + term)
      .then(products => products.data)
      .catch(console.log)
  }

  //this will refresh the visible products from the sidebar filter
  Product.filter = function(filterObj, allProducts) {
    let newProducts = allProducts;
    if (filterObj.type.size > 0) {
      let holdingArr = [];
      filterObj.type.forEach(key => {
        newProducts.forEach(product => {
          if (product.userType === key.toLowerCase()) {
            holdingArr.push(product)
          }
        })
      })
      newProducts = holdingArr;
    }
    if (filterObj.manufacturer.size > 0) {
      let holdingArr = [];
      filterObj.manufacturer.forEach(manufacturer => {
        newProducts.forEach(product => {
          if (product.manufacturer === manufacturer) {
            holdingArr.push(product)
          }
        })
      })
      newProducts = holdingArr;
    }
    if (filterObj.price) {
      newProducts = newProducts.filter(product => product.price <= filterObj.price)
    }

    return newProducts;
  }

  return Product
})
