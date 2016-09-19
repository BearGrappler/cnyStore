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
            templateUrl: 'js/admins-only/order-management.html',
            controller: 'adminOrderMgmtCtrl'
        })

});

app.controller('adminUserMgmtCtrl', function($scope, AuthService, $state, adminsFactory) {


    $scope.error = null;
    $scope.searchResults = null;


    adminsFactory.getUsers()
    .then(function(arrayOfUsers) {
        $scope.searchResults = arrayOfUsers;
     })


    $scope.makeUserAdmin = function(user) {

        adminsFactory.makeUserAdmin(user)
        .then(function() {
             $state.reload()
         })

    }

    $scope.resetPassword = function(user) {

        console.log('you hit resetPassword');
        console.log(user)
    }

    $scope.deleteUser = function(user) {

        adminsFactory.deleteUser(user)
        .then(function(){
            $state.reload()
        })
    }
});

app.controller('adminOrderMgmtCtrl', function($scope, AuthService, $state, adminsFactory) {


    $scope.error = null;
    $scope.searchResults = null;


    adminsFactory.getOrders()
    .then(function(arrayOfOrders){
        console.log('here are the arrayOfOrders', arrayOfOrders)
        $scope.searchResults = arrayOfOrders;
    })


    $scope.makeUserAdmin = function(user) {

        adminsFactory.makeUserAdmin(user)
        .then(function() {
             $state.reload()
         })

    }

    $scope.resetPassword = function(user) {

        console.log('you hit resetPassword');
        console.log(user)
    }

    $scope.deleteUser = function(user) {

        adminsFactory.deleteUser(user)
        .then(function(){
            $state.reload()
        })
    }
});
