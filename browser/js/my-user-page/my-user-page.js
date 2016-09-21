app.config(function($stateProvider) {

    $stateProvider.state('myUserPage', {
            url: '/myUserPage',
            templateUrl: 'js/my-user-page/my-user-page.html',
            controller: 'myUserPageCtrl',
            resolve: {
                myUserInfo: function($http) {
                    return $http.get('/api/users/me').then(function(obj) {
                        return obj.data;
                    })
                }
            }
        })
        .state('myUserPage.addresses', {
            url: '/addresses',
            templateUrl: 'js/my-user-page/addresses.html',
            controller: 'myUserPageAddressesCtrl',
            resolve: {
                myBillings: function($http) {
                    return $http.get('/api/users/me/myBillingAddresses')
                        .then(function(obj) {
                            return obj.data
                        })
                },
                myShippings: function($http) {
                    return $http.get('/api/users/me/myShippingAddresses').then(function(obj) {
                        return obj.data
                    })
                }
            }
        })
        .state('myUserPage.reviews', {
            url: '/reviews',
            templateUrl: 'js/my-user-page/reviews.html',
            controller: 'myUserPageReviewsCtrl',
            resolve: {
                reviews: function($http) {
                    return $http.get('/api/users/me/myReviews').then(function(obj) {
                        return obj.data
                    })
                }
            }
        })
        .state('myUserPage.orders', {
            url: '/orders',
            templateUrl: 'js/my-user-page/orders.html',
            controller: 'myUserPageOrdersCtrl',
            resolve: {
                orders: function(OrderFactory) {
                    return OrderFactory.getOrders();
                }
            }
        })
})


app.controller('myUserPageCtrl', function($scope, $state, myUserInfo) {


    $scope.error = null;
    $scope.myUserInfo = myUserInfo;
    console.log('in myUserPageCtrl with my user info yo ', myUserInfo)
});

app.controller('myUserPageAddressesCtrl', function($scope, $state, myUserInfo, myBillings, myShippings) {


    $scope.error = null;
    $scope.myUserInfo = myUserInfo;
    $scope.myBillingAddresses = myBillings;
    $scope.myShippingAddresses = myShippings;
    $scope.addresses = myBillings.concat(myShippings)

});

app.controller('myUserPageReviewsCtrl', function($scope, $state, myUserInfo, reviews) {

    $scope.error = null;
    $scope.reviews = reviews;

});

app.controller('myUserPageOrdersCtrl', function($scope, $state, myUserInfo, orders) {


    $scope.error = null;
    $scope.orders = orders;

});
