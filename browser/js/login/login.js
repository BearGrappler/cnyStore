app.config(function($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function($scope, AuthService, $state) {

    $scope.login = {};
    $scope.error = null;


    $scope.sendLogin = function(loginInfo) {

        $scope.error = null;

        if ($scope.loginForm.$valid) {
            AuthService.login(loginInfo).then(function() {
                $state.go('questions');
            }).catch(function() {
                $scope.error = 'Invalid login credentials.';
            });
        } else {
            $scope.error = 'Not valid input! Please correct.'
        }

    };

});
