app.config(function($stateProvider) {

    $stateProvider.state('questions', {
        url: '/discovery',
        templateUrl: 'js/questions/questions.html',
        controller: 'QuestionCtrl'
    });

});

app.controller('QuestionCtrl', function($scope, AuthService, QStackFactory) {
    
    $scope.qstack = QStackFactory.initialize();
    $scope.current = $scope.qstack.advance();
    $scope.selected = new Map($scope.qstack.displayed.map(node => [node, false]));

    $scope.select = function(node) {
        $scope.selected.set(node, !$scope.selected.get(node))
        return node.selectNode();
    }
    $scope.advance = function() {
        if ([...$scope.selected.values()].every(value => value === false)) return;
        $scope.current = $scope.qstack.advance();
        $scope.selected.clear();
        $scope.selected = new Map($scope.qstack.displayed.map(node => [node, false]));
    }
});
