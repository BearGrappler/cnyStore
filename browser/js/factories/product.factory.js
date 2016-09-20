app.factory('ProductFactory', function($http, CartFactory) {
  let Product = {};

  let filter = {};
  let allProducts = [];
  let currentProduct = {};

  Product.setFilter = function() {
    return Product.getAll()
      .then(function(products) {
        allProducts = products;
        filter = {};
        let configObj = {};
        let upgradeTypes = ['ram', 'cpu', 'hdd', 'gpu'];
        filter = Product.getFilter();
        filter.type = new Set(filter.type);
        filter.manufacturers = new Set([]);
        upgradeTypes.forEach(type => { configObj[type] = filter[type] });
        filter.configObj = configObj;
      })
  }

  Product.getFilter = function() {
    return filter;
  }

  Product.findManufacturers = function() {
    let manufacturers = new Set([]);
    allProducts.forEach(product => manufacturers.add(product.manufacturer));
    return manufacturers;
  }

  Product.addManufacturer = function(manufacturer) {
    if (filter.manufacturers.has(manufacturer)) {
      filter.manufacturers.delete(manufacturer)
    } else {
      filter.manufacturers.add(manufacturer)
    }
  }

  Product.addPriceToFilter = function(price) {
    filter.price = price;
  }

  Product.addUserTypeToFilter = function(type) {
    if (filter.type.has(type)) {
      filter.type.delete(type)
    } else {
      filter.type.add(type)
    }
  }

  //this will refresh the visible products from the sidebar filter
  Product.filter = function() {
    let newProducts = allProducts;
    if (filter.type && filter.type.size > 0) {
      let holdingArr = [];
      filter.type.forEach(key => {
        newProducts.forEach(product => {
          if (product.userType === key.toLowerCase()) {
            holdingArr.push(product)
          }
        })
      })
      newProducts = holdingArr;
    }
    if (filter.manufacturers.size > 0) {
      let holdingArr = [];
      filter.manufacturers.forEach(manufacturer => {
        newProducts.forEach(product => {
          if (product.manufacturer === manufacturer) {
            holdingArr.push(product)
          }
        })
      })
      newProducts = holdingArr;
    }
    if (filter.price) {
      newProducts = newProducts.filter(product => product.price <= filter.price)
    }
    console.log('done filtering:', newProducts)
    return newProducts;
  }

  Product.getRecommendedConfig = function() {
    let recommendedConfig = {};
    let totalConfigValue = Object.keys(filter.configObj).reduce(((a, b) => a + filter.configObj[b]), 0);
    recommendedConfig.cpu = currentProduct.cpu[Math.round(filter.configObj.cpu / totalConfigValue * currentProduct.cpu.length)];
    recommendedConfig.ram = currentProduct.ram[Math.round(filter.configObj.ram / totalConfigValue * currentProduct.ram.length)];
    recommendedConfig.hdd = currentProduct.hdd[Math.round(filter.configObj.hdd / totalConfigValue * currentProduct.hdd.length)];
    recommendedConfig.gpu = currentProduct.gpu[Math.round(filter.configObj.gpu / totalConfigValue * currentProduct.gpu.length)];

    return recommendedConfig;
  }

  //this will take care of search queries from the search bar
  Product.findBySearchFilter = function(term) {
    return $http.get('/api/products?search=' + term)
      .then(products => products.data)
      .catch(console.log)
  }


  //gets a single product by ID
  Product.getOne = function(productId) {
    return $http.get('/api/products/' + productId)
      .then(product => product.data)
      .then(product => {
        currentProduct = product;
        return currentProduct
      })
  }

  //gets all products
  Product.getAll = function() {
    return $http.get('/api/products/')
      .then(products => products.data)
  }

  //extracts the upgrades from the http response and puts them on the product
  Product.getUpgrades = function() {
    let upgradeTypes = ['ram', 'cpu', 'hdd', 'gpu']
    return $http.get('/api/products/' + currentProduct.id + '/upgrades')
      .then(upgrades => upgrades.data)
      .then(upgrades => {
        upgradeTypes.forEach(type => { currentProduct[type] = [] })
        upgrades.forEach(upgrade => {
          upgrade = upgrade.Upgrades;
          if (upgrade.type === 'ram') {
            currentProduct.ram.push(upgrade)
          } else if (upgrade.type === 'cpu') {
            currentProduct.cpu.push(upgrade)
          } else if (upgrade.type === 'hdd') {
            currentProduct.hdd.push(upgrade)
          } else if (upgrade.type === 'gpu') {
            currentProduct.gpu.push(upgrade)
          }
        })
      })
      .then(function() {
        upgradeTypes.forEach(key => currentProduct[key].sort((a, b) => {
          return a.price < b.price ? -1 : 1
        }))
        return currentProduct
      })
  }

  Product.updateProduct = function(product, updateObj) {
    return $http.put('/api/products/' + product.id, updateObj)
      .then(updatedProduct => updatedProduct.data)
  }

  Product.deleteProduct = function(product) {
    return $http.delete('/api/products/' + product.id)
  }

  Product.addToCart = function(productConfig) {
    let addToCartMap = Object.keys(productConfig).map(key => CartFactory.addToCart(productConfig[key].id))
    return Promise.all(addToCartMap);
  }

  Product.getDefaultConfig = function(product) {
    let defaultConfig = {};
    product.ram.forEach(option => {
      if (option.defOption) {
        defaultConfig.ram = option;
      }
    })
    product.cpu.forEach(option => {
      if (option.defOption) {
        defaultConfig.cpu = option;
      }
    })
    product.hdd.forEach(option => {
      if (option.defOption) {
        defaultConfig.hdd = option;
      }
    })
    product.gpu.forEach(option => {
      if (option.defOption) {
        defaultConfig.gpu = option;
      }
    })
    return defaultConfig;
  }

  return Product
})
