app.factory('ProductFactory', function($http) {
  let Product = {};

  Product.getOne = function(product) {
    $http.get('/products/' + product.id);
  }

  Product.getUpgrades = function(product) {
    $http.get('/products/' + product.id + '/upgrades');
  }

  return Product
})
