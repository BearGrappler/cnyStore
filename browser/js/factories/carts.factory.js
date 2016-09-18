app.factory('CartFactory', function($http) {

    function approveId(id) {
        return /[^0-9]/.test(String(id)) === false;
    }

    function getCarts() {
        return $http.get('/api/cart/').then(res => res.data);
    }

    function getCart(id) {
        if (!approveId(id)) return;
        return $http.get('/api/cart/' + id).then(res => res.data);
    }

    function addCart() {
        return $http.post('/api/cart/').then(res => res.data);
    }

    function deleteCart(id) {
        if (!approveId(id)) return;
        return $http.delete('/api/cart/' + id).then(res => res.data);
    }

    function activateCart(id) {
        if (!approveId(id)) return;
        return $http.put('/api/cart/' + id).then(res => res.data);
    }

    function addToCart(id) {
        if (!approveId(id)) return;
        return $http.post('/api/cart/active/' + id).then(res => res.data);
    }

    function removeFromCart(id) {
        if (!approveId(id)) return;
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
