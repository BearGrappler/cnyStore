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
          return ProductFactory.setFilter(ProductFactory.getFilter()).then(() => ProductFactory.filter());
        }
      }
    })
})

app.controller('ProductListController', function($scope, products, ProductFactory) {
  $scope.products = products;

  // let filter = ProductFactory.getFilter();


  $scope.filterManufacturer = function(manufacturer) {
    ProductFactory.addManufacturer(manufacturer);
    $scope.products = ProductFactory.filter();
  }

  $scope.filterPrice = function(price) {
    ProductFactory.addPriceToFilter(price);
    $scope.products = ProductFactory.filter();
  }

  $scope.filterType = function(type) {
    ProductFactory.addUserTypeToFilter(type);
    $scope.products = ProductFactory.filter();
  }

  $scope.manufacturers = Array.from(ProductFactory.findManufacturers());
  $scope.userTypes = ['Gamer', 'Student', 'Artist', 'Casual'];
  $scope.productTypes = ['base', 'ram', 'cpu', 'gpu', 'hdd'];
})
