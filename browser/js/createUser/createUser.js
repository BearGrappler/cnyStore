app.config(function ($stateProvider) {

    $stateProvider.state('createUser', {
        url: '/createUser',
        templateUrl: 'js/createUser/createUser.html',
        controller: 'CreateUserCtrl'
    });

});

app.controller('CreateUserCtrl', function ($scope, AuthService, $state) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;
        console.log('heres the loginInfo', loginInfo);

        AuthService.login(loginInfo).then(function () {
            $state.go('home');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };

});
