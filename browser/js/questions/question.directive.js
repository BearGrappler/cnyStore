app.directive('questionTile', function() {
    return {
        restrict: 'E',
        templateUrl: 'js/questions/question-tile.html',
        scope: {
            choose: '&',
            answer: '='
        }
    }
});
