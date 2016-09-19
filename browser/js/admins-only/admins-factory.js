app.factory('adminsFactory', function($http) {
    var adminsFactory = {};

    adminsFactory.getUsers = function() {
        // console.log('we are looking for a user in adminsFactoryfindUser')

        return $http.get('/api/users')
            .then(function(arrayOfUsers) {
                console.log('got something from adminsFactory findUsers')
                // console.log('successfully hit adminsFactory find Users')
                // console.log(arrayOfUsers);
                return arrayOfUsers.data;
            })
    }

    adminsFactory.makeUserAdmin = function(user){
        console.log('Hit makeUserAdmin func in adminsFactory' , user);

        return $http.put('/api/users/makeAdmin', user)

    }

    adminsFactory.deleteUser = function(user){
        console.log('Hit deleteUser func in adminsFactory' , user);
        return $http.delete('/api/users/deleteUser/' + user.id)

    }
    return adminsFactory;
});
