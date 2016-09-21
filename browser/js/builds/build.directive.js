app.directive('buildTile', function(CartFactory, $log, $uibModal, $state) {
    return {
        restrict: 'E',
        templateUrl: 'js/builds/build-tile.html',
        scope: {
            comp: '=',
            exec: '&',
            closefn: '&',
            type: '@',
            purchase: '&'
        },
        link: function(scope) {
            scope.button = scope.type === 'button' ? 1 : 0;
            scope.build = scope.type === 'build' ? 1 : 0;
            scope.order = scope.type === 'order' ? 1 : 0;

            scope.clickTile = function(id) {
                if (scope.button) {
                    return scope.exec({ target: id });
                } else {
                    return scope.inspect(id);
                }
            }

            scope.delete = function(id, $event) {
                $event.stopPropagation();
                let modalInstance = $uibModal.open({
                    controller: function($scope, $uibModalInstance) {
                        $scope.delete = function() {
                            $uibModalInstance.close(true);
                        }
                        $scope.cancel = function() {
                            $uibModalInstance.dismiss();
                        }
                    },
                    templateUrl: 'js/builds/delete.modal.html'
                })

                modalInstance.result.then(result => {
                    if (!result) {
                        return;
                    } else {
                        scope.closefn({ toRemove: id });
                    }
                })
            }

            scope.inspect = function(id) {

                scope.exec({ target: id })
                let modalInstance = $uibModal.open({
                    controller: function($scope, $uibModalInstance, build, OrderFactory) {
                        $scope.build = build;
                        $scope.base = build.Items.find(item => item.type === 'base');

                        $scope.purchase = function() {
                            $uibModalInstance.close(true);
                        }
                        $scope.cancel = function() {
                            $uibModalInstance.dismiss();
                        }
                        $scope.checkout = function(token) {
                            $uibModalInstance.dismiss();
                            return OrderFactory.purchaseCart(token, 1);
                        }
                    },
                    templateUrl: 'js/builds/inspect.modal.html',
                    resolve: {
                        build: function() {
                            return scope.comp;
                        }
                    }
                })

                modalInstance.result.then(() => {
                    $state.reload();
                })
            }
        }
    }
})
