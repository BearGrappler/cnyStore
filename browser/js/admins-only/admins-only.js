app.config(function($stateProvider) {

    $stateProvider.state('adminsOnly', {
            url: '/adminsOnly',
            templateUrl: 'js/admins-only/admins-only.html'
                // controller: 'adminsCtrl'
        })
        .state('adminsOnly.UserMgmt', {
            url: '/UserManagement',
            templateUrl: 'js/admins-only/user-management.html',
            controller: 'adminUserMgmtCtrl',
            resolve: {
                users : function($http){
                    return $http.get('/api/users')
                        .then(function(arrayOfUsers) {
                            console.log('hitting this resolve')
                            // console.log('successfully hit adminsFactory find Users')
                            // console.log(arrayOfUsers);
                            return arrayOfUsers.data;
                        })
                }
            }
        })

        .state('adminsOnly.ProdMgmt', {
            url: '/ProdManagement',
            templateUrl: 'js/admins-only/product-management.html'
            // controller: 'adminProdMgmtCtrl'
        })

        .state('adminsOnly.OrderMgmt', {
            url: '/OrderManagement',
            templateUrl: 'js/admins-only/order-management.html',
            controller: 'adminOrderMgmtCtrl',
            resolve: {
                orders : function($http){
                     return $http.get('/api/orders/adminsOnly/getAll')
                        .then(function(response){
                            return response.data;
                        })
                }
            }
        })

});

app.controller('adminUserMgmtCtrl', function($scope, AuthService, $state, adminsFactory, users) {


    $scope.error = null;
    $scope.searchResults = users;

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

app.controller('adminOrderMgmtCtrl', function($scope, AuthService, $state, adminsFactory, orders) {


    $scope.error = null;
    $scope.searchResults = orders;


    $scope.changeToProcessing = function(order) {
        adminsFactory.changeStatusOfOrder(order, 'processing')
        .then(function(){
            $state.reload()
        })

    }

    $scope.changeToShipped = function(order) {
        adminsFactory.changeStatusOfOrder(order, 'shipped')
        .then(function(){
            $state.reload()
        })

    }

    $scope.changeToDelivered = function(order) {
        adminsFactory.changeStatusOfOrder(order, 'delivered')
        .then(function(){
            $state.reload()
        })

    }

    $scope.changeToCancelled = function(order) {
        adminsFactory.changeStatusOfOrder(order, 'cancelled')
        .then(function(){
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

    // $scope.changeToCreated = function('Created',)
});
