app.directive('buildTile', function(CartFactory, $log, $uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'js/builds/build-tile.html',
        scope: {
            comp: '=',
            exec: '&',
            closefn: '&'
        },
        link: function(scope) {
            if (!scope.comp) {
                if (scope.comp === null) scope.addButton = 1;
                scope.tile = { immutable: true, type: true }
            }

            scope.tile = scope.comp;

            scope.total = scope.comp ? scope.comp.Items
                .map(product => product.price).reduce((_a, _b) => _a + _b, 0) : '';

            scope.delete = function(id, $event) {
                $event.stopPropagation();
                let modalInstance = $uibModal.open({
                    controller: function($scope, $uibModalInstance) {
                        $scope.isDelete = true;
                        $scope.isPurchase = false;
                        $scope.delete = function() {
                            $uibModalInstance.close(true);
                        }
                        $scope.cancel = function() {
                            $uibModalInstance.dismiss();
                        }
                    },
                    templateUrl: 'js/builds/modal.html'
                })
                modalInstance.result.then(result => {
                    if (!result) {
                        return;
                    } else {
                        scope.closefn({ toRemove: id });
                    }
                })
            }

            scope.checkout = function(id, $event, items) {
                $event.stopPropagation();
                let modalInstance = $uibModal.open({
                    scope: scope,
                    controller: function($scope, $state, $uibModalInstance) {
                        $scope.isPurchase = true;
                        $scope.isDelete = false;
                        $scope.purchase = function() {
                            $state.go('purchase')
                        }
                        $scope.cancel = function() {
                            $uibModalInstance.dismiss();
                        }
                    },
                    templateUrl: 'js/builds/modal.html'
                })
            }

        }
    }
})
