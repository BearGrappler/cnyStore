app.directive('buildTile', function() {
    return {
        restrict: 'E',
        templateUrl: 'js/builds/build-tile.html',
        scope: {
            cart: '='
        },
        link: function() {
        }
    }
})
