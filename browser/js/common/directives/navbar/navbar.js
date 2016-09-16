app.directive('navbar', function($rootScope, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function(scope) {

            scope.items = [
                { label: 'Home', state: 'home' },
                { label: 'About', state: 'about' },
                { label: 'Documentation', state: 'docs' },
                { label: 'Members Only', state: 'membersOnly', userType: 'member' },
                { label: 'Admins Only', state: 'adminsOnly', userType: 'admin' }
            ];

            scope.user = null;
            // var what = true


            scope.isLoggedIn = function() {
                return AuthService.isAuthenticated();
            };

            scope.logout = function() {
                AuthService.logout().then(function() {
                    $state.go('home');
                });
            };

            var setUser = function() {
                AuthService.getLoggedInUser().then(function(user) {
                    scope.user = user;
                });
            };

            var removeUser = function() {
                scope.user = null;
            };

            scope.showNavItem = function(item) {

                if (item.userType) {
                    if (scope.user) {
                        if (scope.user.isAdmin) {
                            return true
                        } else if (item.userType === 'member') {
                            return true;
                        } else {
                            return false;
                        }

                    } else {
                        return false;
                    }
                } else {
                    return true;
                }

            };

            setUser();



            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
