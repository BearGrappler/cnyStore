app.config(function($stateProvider) {

    $stateProvider.state('builds', {
        url: '/builds',
        templateUrl: 'js/builds/builds.html',
        controller: 'BuildsCtrl',
        resolve: {
            // builds: function(BuildFactory) {
            //     return BuildFactory.getBuilds();
            // },
            // orders: function(OrderFactory) {
            //     return OrderFactory.getOrders();
            // }
        }
    });

});

app.controller('BuildsCtrl', function($scope, AuthService, $state) {

    $scope.builds = {};
    $scope.error = null;
    // $scope.orders = orders;
    // $scope.builds = builds;

});
