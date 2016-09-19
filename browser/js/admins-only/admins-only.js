app.config(function($stateProvider) {

    $stateProvider.state('adminsOnly', {
            url: '/adminsOnly',
            templateUrl: 'js/admins-only/admins-only.html'
                // controller: 'adminsCtrl'
        })
        .state('adminsOnly.UserMgmt', {
            url: '/UserManagement',
            templateUrl: 'js/admins-only/user-management.html',
            controller: 'adminUserMgmtCtrl'
        })

    .state('adminsOnly.ProdMgmt', {
        url: '/ProdManagement',
        templateUrl: 'js/admins-only/product-management.html'
            // controller: 'adminProdMgmtCtrl'
    })

    .state('adminsOnly.OrderMgmt', {
        url: '/OrderManagement',
        templateUrl: 'js/admins-only/order-management.html'
            // controller: 'adminOrderMgmtCtrl'
    })

});

app.controller('adminUserMgmtCtrl', function($scope, AuthService, $state, adminsFactory) {
    $scope.error = null;
    $scope.searchResults = null;


    adminsFactory.getUsers()
    .then(function(arrayOfUsers) {
         console.log('we got the array of Users \n', arrayOfUsers)
        $scope.searchResults = arrayOfUsers;
     })


    $scope.makeUserValid = function(user) {

        console.log('you hit uservalid');
        console.log(user)
    }

    $scope.resetPassword = function(user) {

        console.log('you hit resetPassword');
        console.log(user)
    }

    $scope.deleteUser = function(user) {

        console.log('you hit DeleteUser');
        console.log(user)
    }
});