app.factory('OrderFactory', function($http) {

    function approveId(id) {
        return /[^0-9]/.test(String(id)) === false;
    }

    function getOrders() {
        return $http.get('/api/orders/').then(res => res.data);
    }

    function getOrder(id) {
        if (!approveId(id)) return;
        return $http.get('/api/orders/' + id).then(res => res.data);
    }

    function purchaseCart(token, AddressId) {
        return $http.post('/api/orders', { stripeToken: token, AddressId }).then(res => res.data);
    }

    return {
        getOrders,
        getOrder,
        purchaseCart
    }
});
