app.factory('ProductFactory', function($http) {
  let Product = {};

  Product.getOne = function(productId) {
    return $http.get('/products/' + productId);
  }

  Product.getUpgrades = function(product) {
    return $http.get('/products/' + product.id + '/upgrades')
      .then(upgrades => {
        product.ram = [];
        product.cpu = [];
        product.storage = [];
        upgrades.forEach(upgrade => {
          if (upgrade.type === 'ram') {
            product.ram.push(upgrade)
          } else if (upgrade.type === 'cpu') {
            product.cpu.push(upgrade)
          } else if (upgrade.type === 'storage') {
            product.storage.push(upgrade)
          }
        })
        return product
      })
  }

  return Product
})
