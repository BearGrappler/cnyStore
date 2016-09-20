app.factory('adminsFactory', function($http) {
    var adminsFactory = {};


    adminsFactory.makeUserAdmin = function(user){
        return $http.put('/api/users/makeAdmin', user)
    }

    adminsFactory.deleteUser = function(user){
        return $http.delete('/api/users/deleteUser/' + user.id)

    }

    adminsFactory.changeStatusOfOrder = function(order, newStatus){
        return $http.put('/api/orders/adminsOnly/' + order.id +'/'+ newStatus)
    }
    return adminsFactory;
});
