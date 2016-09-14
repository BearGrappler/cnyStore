app.factory('ProductFactory', function($http) {
  let Product = {};

  Product.getOne = function(productId) {
    return $http.get('/api/products/' + productId)
    .then(product => product.data)
  }

  Product.getUpgrades = function(product) {
    console.log(product)
    return $http.get('/api/products/' + product.id + '/upgrades')
      .then(upgrades => upgrades.data)
      .then(upgrades => {
        product.ram = [];
        product.cpu = [];
        product.storage = [];
        product.gpu = [];
        upgrades.forEach(upgrade => {
          if (upgrade.type === 'ram') {
            product.ram.push(upgrade)
          } else if (upgrade.type === 'cpu') {
            product.cpu.push(upgrade)
          } else if (upgrade.type === 'hdd') {
            product.storage.push(upgrade)
          } else if (upgrade.type === 'gpu') {
            product.gpu.push(upgrade)
          }
        })
      })
      .then(function() {
        return product
      })
  }

  return Product
})
