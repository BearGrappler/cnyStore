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

app.controller('SingleProductCtrl', function($scope, product, ProductFactory) {
  $scope.editView = false;
  $scope.product = product;
  findDefaultConfiguration();
  $scope.currentConfiguration = {
    base: $scope.product,
    ram: $scope.selectedRam,
    cpu: $scope.selectedCpu,
    hdd: $scope.selectedHdd,
    gpu: $scope.selectedGpu
  }
  $scope.price = product.price;

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

  $scope.updateProduct = function() {
    ProductFactory.updateProduct($scope.updatedProduct)
    .then(product => {if (product) $scope.product = product})
  }

  function findDefaultConfiguration() {
    $scope.defaultConfiguration = {};
    product.ram.forEach(option => {
      if (option.defOption) {
        $scope.defaultConfiguration.ram = option;
      }
    })
    product.cpu.forEach(option => {
      if (option.defOption) {
        $scope.defaultConfiguration.cpu = option;
      }
    })
    product.hdd.forEach(option => {
      if (option.defOption) {
        $scope.defaultConfiguration.hdd = option;
      }
    })
    product.gpu.forEach(option => {
      if (option.defOption) {
        $scope.defaultConfiguration.gpu = option;
      }
    })
  }
})
