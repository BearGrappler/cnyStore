app.config(function($stateProvider) {
  $stateProvider
    .state('product-list', {
      url: '/products/:query',
      controller: 'ProductListController',
      templateUrl: 'js/products/product-list.html',
      resolve: {
        products: function(ProductFactory, $stateParams) {
          let query = $stateParams.query.split(':');
          if (query[0] === 'search') {
            return ProductFactory.findBySearchFilter(query[1])
          }
          if (query[0] === 'type') {
            return ProductFactory.getAllOfType(query[1])
          }
          return ProductFactory.getAll();
        }
      }
    })
})

app.controller('ProductListController', function($scope, products, ProductFactory) {
  $scope.allProducts = products;
  $scope.filteredProducts = products;

  let filters = { manufacturer: new Set([]), type: new Set([]) };

  $scope.manufacturers = new Set();
  $scope.allProducts.forEach(product => $scope.manufacturers.add(product.manufacturer));
  $scope.manufacturers = Array.from($scope.manufacturers)

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

  $scope.filterType = function(type) {
    if (filters.type.has(type)) {
      filters.type.delete(type)
    } else {
      filters.type.add(type)
    }
    $scope.filteredProducts = ProductFactory.filter(filters, $scope.allProducts);
  }

  $scope.userTypes = ['Gamer', 'Student', 'Artist', 'Casual'];
  $scope.productTypes = ['base', 'ram', 'cpu', 'gpu', 'hdd']
})
