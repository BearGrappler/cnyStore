app.factory('CartFactory', function($http) {

    function refresh() {
        return getCarts();
    }

    function total(cart) {
        cart.total = cart.Items.reduce((_a, _b) => {
            return _a + _b.price * 100
        }, 0) / 100;
        return cart;
    }

    function getCarts() {
        return $http.get('/api/cart/')
            .then(res => res.data)
            .then(carts => {
                if (!carts.length) {
                    return;
                } else {
                    carts = carts.map(cart => total(cart));
                    return carts.sort((_a, _b) => {
                        return _a.id < _b.id ? 1 : -1;
                    });
                }
            })
            .catch(console.log);
    }

    function getCart(id) {
        return $http.get('/api/cart/' + id)
            .then(res => res.data)
            .then(cart => total(cart))
            .catch(console.log);
    }

    function addCart() {
        return $http.post('/api/cart/')
            .then(refresh)
            .catch(console.log);
    }

    function deleteCart(id) {
        return $http.delete('/api/cart/' + id)
            .then(refresh)
            .catch(console.log);
    }

    function activateCart(id) {
        return $http.put('/api/cart/' + id)
            .then(refresh)
            .catch(console.log);
    }

    function addToCart(id) {
        return $http.post('/api/cart/active/' + id)
            .then(res => res.data)
            .catch(console.log);

    }

    function removeFromCart(id) {
        return $http.delete('/api/cart/active/' + id)
            .then(res => res.data)
            .catch(console.log);
    }

    function getActiveCart() {
        return $http.get('/api/cart/active/')
            .then(res => res.data)
            .then(cart => total(cart))
            .catch(console.log);
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
