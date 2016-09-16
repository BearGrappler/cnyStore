app.config(function($stateProvider) {
  $stateProvider
    .state('product-list', {
      url: '/products',
      controller: 'ProductListController',
      templateUrl: 'js/products/product-list.html',
      resolve: {
        products: function(ProductFactory) {
          return ProductFactory.getAll();
        }
      }
    })
})

app.controller('ProductListController', function($scope, products, ProductFactory) {
  $scope.allProducts = products;
  $scope.filteredProducts = products;

  let filters = { manufacturer: new Set([]) };

  $scope.filterManufacturer = function(manufacturer) {
    if (filters.manufacturer.has(manufacturer)) {
      filters.manufacturer.delete(manufacturer)
    } else {
      filters.manufacturer.add(manufacturer)
    }
    $scope.filteredProducts = ProductFactory.filter(filters, $scope.allProducts);
  }

  $scope.filterPrice = function(price) {
    filters.price = price;
    $scope.filteredProducts = ProductFactory.filter(filters, $scope.allProducts);
  }
})
