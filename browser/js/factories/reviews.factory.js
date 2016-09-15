app.factory('ReviewFactory', function($http) {

    function approveId(id) {
        return /[^0-9]/.test(String(id)) === false;
    }

    function approveReview(review) {
        return (review.hasOwnProperty('text') && review.hasOwnProperty('rating') && review.hasOwnProperty('ProductId'));
    }

    function getReview(id) {
        if (!approveId(id)) return;
        return $http.get('/api/reviews/' + id).then(res => res.data);
    }

    function addReview(review) {
        if (!approveReview) return;
        return $http.post('/api/reviews/' + review.ProductId, {
                rating: review.rating,
                text: review.text
            })
            .then(res => res.data);
    }

    function deleteReview(id) {
        if (!approveId(id)) return;
        return $http.delete('/api/reviews/' + id).then(res => res.data);
    }

    function editReview(id, review) {
        if (!(approveId(id) && approveReview(review))) return;
        return $http.put('/api/reviews/' + id, {
            rating: review.rating,
            text: review.text
        })
    }

    return {
        getReview,
        addReview,
        deleteReview,
        editReview
    }
});
