app.config(function($stateProvider) {

    $stateProvider.state('cart', {
        url: '/login',
        templateUrl: 'js/cart/cart.html',
        controller: 'CartCtrl'
    });

});

app.controller('CartCtrl', function($scope, AuthService, $state) {

    $scope.login = {};
    $scope.error = null;


    $scope.sendLogin = function(loginInfo) {

        $scope.error = null;

        if ($scope.loginForm.$valid) {
            AuthService.login(loginInfo).then(function() {
                $state.go('home');
            }).catch(function() {
                $scope.error = 'Invalid login credentials.';
            });
        } else {
            $scope.error = 'Not valid input! Please correct.'
        }

    };

});
