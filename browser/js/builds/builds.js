app.config(function($stateProvider) {

    $stateProvider.state('builds', {
        url: '/builds',
        templateUrl: 'js/builds/builds.html',
        controller: 'BuildsCtrl',
        resolve: {
            allBuilds: function(CartFactory) {
                return CartFactory.getCarts();
            },
            orders: function(OrderFactory) {
                return OrderFactory.getOrders();
            }
        }
    });

});

app.controller('BuildsCtrl', function($scope, AuthService, orders, allBuilds, $injector, $log) {

    let CartFactory = $injector.get('CartFactory');
    let OrderFactory = $injector.get('OrderFactory');
    // let $state = $injector.get('$state');

    $scope.builds = {};
    $scope.error = null;
    $scope.orders = orders.map(order => {
        order.immutable = true;
        return order;
    });
    $scope.builds = allBuilds;

    $scope.isLoggedIn = function() {
        return AuthService.isAuthenticated();
    }

    $scope.newBuild = function() {
        CartFactory.addCart()
            .then(carts => {
                $scope.builds = carts;
            })
            .catch($log.error);
    }

    $scope.deleteBuild = function(id) {
        CartFactory.deleteCart(id)
            .then(carts => {
                $scope.builds = carts;
            })
            .catch($log.error)
    }

    $scope.activate = function(id) {
        CartFactory.activateCart(id)
            .then(carts => {
                $scope.builds = carts;
            })
            .catch($log.error);
    }

    $scope.checkout = function(token) {
        return OrderFactory.purchaseCart(token, 1);
    }

});
