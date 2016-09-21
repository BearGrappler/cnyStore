app.config(function($stateProvider) {

    $stateProvider.state('purchase', {
        url: '/purchase',
        templateUrl: 'js/stripe/stripe.html',
        controller: 'StripeCtrl'
    });

});

app.controller('StripeCtrl', function($scope, AuthService, $state, OrderFactory) {

    $scope.error = null;

    $scope.checkout = function(token) {
        return OrderFactory.purchaseCart(token, 1).then(data => console.log(data));
    }
});
