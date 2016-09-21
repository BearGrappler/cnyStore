app.config(function($stateProvider) {
  $stateProvider
    .state('single-product', {
      url: '/product/:id',
      controller: 'SingleProductCtrl',
      templateUrl: 'js/products/single-product.html',
      resolve: {
        product: function(ProductFactory, $stateParams) {
          return ProductFactory.getOne($stateParams.id)
            .then(product => ProductFactory.getUpgrades(product))
        }
      }
    })
})

app.controller('SingleProductCtrl', function($scope, $state, product, ProductFactory, AuthService, ReviewFactory) {


  $scope.isUser = AuthService.isAuthenticated();
  $scope.isAdmin = AuthService.isAdmin();

  $scope.editView = false;
  $scope.product = product;
  $scope.price = product.price;
  $scope.updatedProduct = {};
  ['name', 'price', 'description'].forEach(key => { $scope.updatedProduct[key] = $scope.product[key] })
  $scope.defaultConfiguration = ProductFactory.getDefaultConfig($scope.product)

  $scope.calculatePrice = function() {
    let price = product.price;
    Object.keys($scope.defaultConfiguration).forEach(key => { price -= $scope.defaultConfiguration[key].price })
    $scope.basePrice = price;
    if ($scope.selectedCpu) {
      price += $scope.selectedCpu.price
    }
    if ($scope.selectedRam) {
      price += $scope.selectedRam.price
    }
    if ($scope.selectedHdd) {
      price += $scope.selectedHdd.price
    }
    if ($scope.selectedGpu) {
      price += $scope.selectedGpu.price
    }
    $scope.price = price
  }

  if (ProductFactory.getFilter().configObj && ProductFactory.getFilter().configObj.cpu) {
    $scope.recommendedConfig = ProductFactory.getRecommendedConfig();
    $scope.options = Object.keys($scope.recommendedConfig);
    $scope.selectedCpu = $scope.recommendedConfig.cpu;
    $scope.selectedRam = $scope.recommendedConfig.ram;
    $scope.selectedGpu = $scope.recommendedConfig.gpu;
    $scope.selectedHdd = $scope.recommendedConfig.hdd;
  } else {
    $scope.selectedCpu = $scope.product.cpu[0];
    $scope.selectedRam = $scope.product.ram[0];
    $scope.selectedGpu = $scope.product.gpu[0];
    $scope.selectedHdd = $scope.product.hdd[0];
    $scope.recommendedConfig = false;
  }
  $scope.calculatePrice();



  $scope.addReview = function() {
    console.log('adding review')
    $scope.review.ProductId = $scope.product.id;
    ReviewFactory.addReview($scope.review);
  }

  $scope.updateProduct = function() {
    return ProductFactory.updateProduct($scope.product, $scope.updatedProduct)
      .then(newProduct => {
        if (newProduct) $scope.product = newProduct })
  }

  $scope.deleteProduct = function() {
    return ProductFactory.deleteProduct($scope.product)
  }

  $scope.hasUpgrades = function() {
    return (product.cpu.length || product.gpu.length || product.hdd.length || product.ram.length)
  }

  $scope.addToCart = function() {
    $scope.product.price = $scope.basePrice;
    let currentConfiguration = [$scope.product, $scope.selectedRam, $scope.selectedCpu, $scope.selectedHdd, $scope.selectedGpu]
    return ProductFactory.addToCart(currentConfiguration)
  }


})
