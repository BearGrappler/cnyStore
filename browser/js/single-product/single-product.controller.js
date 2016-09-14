app.config(function($stateProvider) {
  $stateProvider
    .state('single-product', {
      url: '/product/:id',
      controller: 'SingleProductCtrl',
      templateUrl: 'js/single-product/single-product.html',
      resolve: {
        product: function(ProductFactory, $stateParams) {
          return ProductFactory.getOne($stateParams.id)
            .then(product => ProductFactory.getUpgrades(product))
        }
      }
    })
})

app.controller('SingleProductCtrl', function($scope, product) {
  $scope.product = product
})
