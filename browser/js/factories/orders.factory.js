app.factory('OrderFactory', function($http) {

    function total(order) {
        order.total = order.Products.reduce((_a, _b) => {
            return _a + _b.price * 100
        }, 0) / 100;
        return order;
    }

    function getOrders() {
        return $http.get('/api/orders/')
            .then(res => res.data)
            .then(orders => orders.map(order => total(order)))
            .catch(console.log);
    }

    function getOrder(id) {
        return $http.get('/api/orders/' + id).then(res => res.data)
        .then(order => total(order))
        .catch(console.log);
    }

    function purchaseCart(token, AddressId) {
        return $http.post('/api/orders', { stripeToken: token, AddressId })
        .catch(console.log);
    }

    return {
        getOrders,
        getOrder,
        purchaseCart
    }
});
