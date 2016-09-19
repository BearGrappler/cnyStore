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
    let $state = $injector.get('$state');

    $scope.builds = {};
    $scope.error = null;
    $scope.orders = orders;
    $scope.builds = allBuilds;

    $scope.newBuild = function() {
        CartFactory.addCart().then(() => {
                return CartFactory.getCarts();
            })
            .then(carts => {
                $scope.builds = carts;
            })
            .catch($log.error);
    }

});
