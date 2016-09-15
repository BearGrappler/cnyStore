app.config(function($stateProvider) {

    $stateProvider.state('createUser', {
        url: '/createUser',
        templateUrl: 'js/createUser/createUser.html',
        controller: 'CreateUserCtrl'
    });

});

app.controller('CreateUserCtrl', function($scope, AuthService, $state) {

    $scope.newUser = {};
    $scope.error = null;


    $scope.createUser = function(newUserInfo) {

        if($scope.loginForm.$valid){
            if (newUserInfo.password !== newUserInfo.confirmPassword) {
                $scope.error = 'Incorrect Password!';
            } else {
                AuthService.createUser(newUserInfo).then(function(){
                    $state.go('home')
                })
                .catch(function(){
                    $scope.error = 'Failed to Create the new User'
                })
            }
        }
        else{
            $scope.error = 'Not valid input! Please correct.'
        }
    }
});
