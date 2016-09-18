app.factory('ReviewFactory', function($http) {

    function approveId(id) {
        return /[^0-9]/.test(String(id)) === false;
    }

    function approveReview(review) {
        return (review.hasOwnProperty('text') && review.hasOwnProperty('rating') && review.hasOwnProperty('ProductId'));
    }

    /**
     * Retrieves all reviews for a product.
     * @param  {[Number || String]} id [PRODUCT ID]
     * @return {[Array]}    [Promise for an array of reviews for a product]
     */
    function getReviews(id) {
        if (!approveId(id)) return;
        return $http.get('/api/reviews/all/' + id).then(res => res.data);
    }

    /**
     * Retrieves a single review for a product by review id.
     * @param  {[Number || String]} id [REVIEW ID]
     * @return {[Object]}    [Promise for a review object]
     */
    function getReview(id) {
        if (!approveId(id)) return;
        return $http.get('/api/reviews/' + id).then(res => res.data);
    }

    /**
     * Creates a new review for a product.
     * @param {[Object]} review [A review object with text, rating, and PRODUCT ID properties]
     * @return {[Object]} [Promise for the created review]
     */
    function addReview(review) {
        if (!approveReview(review)) return;
        return $http.post('/api/reviews/' + review.ProductId, {
                rating: review.rating,
                text: review.text
            })
            .then(res => res.data);
    }

    /**
     * Deletes a specific review
     * @param  {[Number || String]} id [REVIEW ID]
     * @return {[Promise]}    [Promise to delete the review]
     */
    function deleteReview(id) {
        if (!approveId(id)) return;
        return $http.delete('/api/reviews/' + id).then(res => res.data);
    }

    /**
     * Edits a specified review with the provided values to update
     * @param  {[Number || String]} id     [REVIEW ID]
     * @param  {[Object]} review [A review object with text, rating, and PRODUCT ID properties]
     * @return {[Object]}        [Promise for the updated review]
     */
    function editReview(id, review) {
        if (!(approveId(id) && approveReview(review))) return;
        return $http.put('/api/reviews/' + id, {
            rating: review.rating,
            text: review.text
        })
    }

    return {
        getReviews,
        getReview,
        addReview,
        deleteReview,
        editReview
    }
});
