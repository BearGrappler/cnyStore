app.factory('adminsFactory', function($http) {
    var adminsFactory = {};


    adminsFactory.makeUserAdmin = function(user){
        console.log('Hit makeUserAdmin func in adminsFactory' , user);

        return $http.put('/api/users/makeAdmin', user)

    }

    adminsFactory.deleteUser = function(user){
        console.log('Hit deleteUser func in adminsFactory' , user);
        return $http.delete('/api/users/deleteUser/' + user.id)

    }

    adminsFactory.changeStatusOfOrder = function(order, newStatus){
        console.log('Hit makeUserAdmin func in adminsFactory' , order);
        return $http.put('/api/orders/adminsOnly/' + order.id +'/'+ newStatus)

    }
    return adminsFactory;
});
