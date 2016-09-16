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

app.controller('ProductListController', function($scope, products) {
  $scope.allProducts = products;
  $scope.filteredProducts = products;

  let filters = { manufacturer: new Set([]) };

  $scope.filterManufacturer = function(manufacturer) {
    if (filters.manufacturer.has(manufacturer)) {
      filters.manufacturer.delete(manufacturer)
    } else {
      filters.manufacturer.add(manufacturer)
    }
    filter(filters)
  }

  $scope.filterPrice = function(price) {
    filters.price = price;
    filter(filters);
  }

  function filter(filterObj) {
    let newProducts = [];
    if (filterObj.manufacturer.size > 0) {
      filterObj.manufacturer.forEach(manufacturer => {
        $scope.allProducts.forEach(product => {
          if (product.manufacturer === manufacturer) newProducts.push(product)
        })
      })
    } else {
      newProducts = $scope.allProducts;
    }
    if (filterObj.price) {
      newProducts = newProducts.filter(product => product.price <= filterObj.price)
    }
    $scope.filteredProducts = newProducts;
  }

})