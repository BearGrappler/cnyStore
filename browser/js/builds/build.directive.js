app.directive('buildTile', function() {
    return {
        restrict: 'E',
        templateUrl: 'js/builds/build-tile.html',
        scope: {
            comp: '=',
            exec: '&'
        },
        link: function(scope) {
            scope.addButton = scope.comp === null ? 1 : 0;
            scope.total = scope.comp ? scope.comp.Items.map(product => product.price).reduce((_a, _b) => _a + _b, 0) : '';
        }
    }
})
