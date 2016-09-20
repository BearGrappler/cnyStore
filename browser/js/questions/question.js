app.config(function($stateProvider) {

    $stateProvider.state('questions', {
        url: '/',
        templateUrl: 'js/questions/questions.html',
        controller: 'QuestionCtrl'
    });

});

app.controller('QuestionCtrl', function($scope, $state, AuthService, QStackFactory, ProductFactory) {

    $scope.qstack = QStackFactory;

    /**
     * Starts a new question process
     * @return {[undefined]} [Side effects only]
     */
    $scope.start = function() {
        $scope.qstack.start();
        $scope.current = $scope.qstack.advance();
        $scope.selected = new Map($scope.qstack.displayed.map(node => [node.id, false]));
    }

    // Starts the questionnaire initially.
    $scope.start();

    /**
     * Toggles the node as selected.
     * @param  {[Object]} node [QTree]
     * @return {[Object]}      [Used for side effects only]
     */
    $scope.select = function(node) {
        $scope.selected.set(node.id, !$scope.selected.get(node.id))
        return node.selectNode();
    }

    /**
     * Wrapper around QStack's advance method. Uses a Map of all selected nodes to prevent erroenous submits
     * @return {[type]} [description]
     */
    $scope.advance = function() {
        if ([...$scope.selected.values()].every(value => value === false)) return;
        $scope.current = $scope.qstack.advance();
        $scope.selected.clear();
        $scope.selected = new Map($scope.qstack.displayed.map(node => [node.id, false]));
        if (!$scope.current) {
            ProductFactory.setFilter($scope.qstack.currentFilters);
            return $state.go('product-list');
        }
    }

});
