app.config(function($stateProvider) {

    $stateProvider.state('questions', {
        url: '/discovery',
        templateUrl: 'js/questions/questions.html',
        controller: 'QuestionCtrl'
    });

});

app.controller('QuestionCtrl', function($scope, AuthService, QuestionFactory) {
    $scope.qstack = QuestionFactory.initialize();
    $scope.current = $scope.qstack.advance();
    $scope.select = function(node) {
        return node.selectNode();
    }
    $scope.advance = function() {
        $scope.current = $scope.qstack.advance();
    }
});
