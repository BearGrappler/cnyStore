app.factory('CartFactory', function($http) {

    function refresh() {
        return getCarts();
    }

    function getCarts() {
        return $http.get('/api/cart/')
            .then(res => res.data)
            .then(carts => carts.sort((_a, _b) => {
                return _a.id < _b.id ? 1 : -1;
            }));
    }

    function getCart(id) {
        return $http.get('/api/cart/' + id).then(res => res.data);
    }

    function addCart() {
        return $http.post('/api/cart/').then(refresh);
    }

    function deleteCart(id) {
        return $http.delete('/api/cart/' + id).then(refresh);
    }

    function activateCart(id) {
        return $http.put('/api/cart/' + id).then(refresh);
    }

    function addToCart(id) {
        return $http.post('/api/cart/active/' + id).then(res => res.data);
    }

    function removeFromCart(id) {
        return $http.delete('/api/cart/active/' + id).then(res => res.data);
    }

    function getActiveCart() {
        return $http.get('/api/cart/active/').then(res => res.data);
    }

    return {
        getCarts,
        getCart,
        addCart,
        deleteCart,
        activateCart,
        addToCart,
        removeFromCart,
        getActiveCart
    }
});
