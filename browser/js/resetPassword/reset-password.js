app.config(function ($stateProvider) {

    $stateProvider.state('resetPassword', {
        url: '/reset-password',
        templateUrl: 'js/resetPassword/reset-password-form.html',
        controller: 'resetPasswordCtrl'
    });

});


app.controller('resetPasswordCtrl', function($scope, resetPasswordFactory){
    $scope.resetPassword = function(email){
        console.log('about to run reset password in the resetpassword function in the controller' ,email)
        resetPasswordFactory.resetPassword(email)
        .then(function(){
            console.log('we done');
        })
    }

})
