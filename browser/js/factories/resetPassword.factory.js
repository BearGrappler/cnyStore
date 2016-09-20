app.factory('resetPasswordFactory', function($http) {

    var resetPasswordFactory = {};

    resetPasswordFactory.resetPassword = function(email){
        console.log('in the resetPassword factory about to send', email)
        return $http.post('/api/users/forgot', email)
        .then(function(){
            console.log('resetPasswordFactory successfully reset!')
            //$state.go/login  inject stateProviders
        })
    }


    return resetPasswordFactory
});
