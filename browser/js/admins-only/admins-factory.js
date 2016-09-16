app.factory('adminsFactory', function($http) {
    var adminsFactory = {};

    adminsFactory.getUsers = function() {
        console.log('we are looking for a user in adminsFactoryfindUser')

        return $http.get('/api/users/findUsers')
                .then(function(arrayOfUsers){
                    console.log('got something from adminsFactory findUsers')
                    if(arrayOfUsers.length){
                        return false
                    }
                    console.log('successfully hit adminsFactory find Users')
                    console.log(arrayOfUsers);
                    return arrayOfUsers.data;
                })

    }
    return adminsFactory;
});
