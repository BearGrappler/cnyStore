app.config(function($stateProvider) {
  $stateProvider
    .state('product-list', {
      url: '/products/',
      controller: 'ProductListController',
      templateUrl: 'js/products/product-list.html',
      resolve: {
        products: function(ProductFactory) {
          return ProductFactory.getAll();
        }
      }
    })
})

app.controller('ProductListController', function($scope, products) {
  $scope.products = products;
})
