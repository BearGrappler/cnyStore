'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

window.app = angular.module('FullstackGeneratedApp', ['fsaPreBuilt', 'ui.router', 'ui.bootstrap', 'ngAnimate']);

app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
    // Trigger page refresh when accessing an OAuth route
    $urlRouterProvider.when('/auth/:provider', function () {
        window.location.reload();
    });
});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function destinationStateRequiresAuth(state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        AuthService.getLoggedInUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                $state.go('login');
            }
        });
    });
});

app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });
});

app.controller('AboutController', function ($scope, FullstackPics) {

    // Images of beautiful Fullstack people.
    $scope.images = _.shuffle(FullstackPics);
});

app.config(function ($stateProvider) {
    $stateProvider.state('docs', {
        url: '/docs',
        templateUrl: 'js/docs/docs.html'
    });
});

app.factory('QStackFactory', function ($http, QTreeFactory) {

    var defaultFilters = {
        computer: [],
        type: [],
        price: [],
        priority: [],
        processor: [],
        ram: [],
        hdd: [],
        cpu: [],
        gpu: []
    };

    var Questionnaire = QTreeFactory.bind(QTreeFactory);

    // Probably should move to a database at some point in the future timeline...
    var questions = {
        home: new Questionnaire(0, 'Home', 'Which type of computer are you looking for?', {}),
        desktop: new Questionnaire(1, 'Desktop', 'Which type of user are you?', { computer: 'desktop' }),
        laptop: new Questionnaire(2, 'Laptop', 'Which type of user are you?', { computer: 'laptop' }),
        gamer: new Questionnaire(3, 'Gamer', 'Select your favorite genres', { type: 'gamer' }),
        artist: new Questionnaire(4, 'Artist', 'Do you work with audio? Video? More creative media?', { type: 'artist' }),
        student: new Questionnaire(5, 'Student', 'What are you studying?', { type: 'student' }),
        casual: new Questionnaire(6, 'Casual', "What's important to you?", { type: 'casual' }),

        gamerGenreRTS: new Questionnaire(7, 'Strategy', "What's important to you?", { cpu: '4', ram: '4', gpu: '2' }),
        gamerGenreRPG: new Questionnaire(8, 'Role Playing Games', "What's important to you?", { cpu: '4', ram: '3', gpu: '4' }),
        gamerGenreFPS: new Questionnaire(9, 'FPS/Action', "What's important to you?", { cpu: '4', ram: '3', gpu: '4' }),
        gamerGenreINDIE: new Questionnaire(10, 'Indie', "What's important to you?", { cpu: '2', ram: '2', gpu: '2' }),

        artistGenreAudio: new Questionnaire(11, 'Audio', "What's important to you?", { cpu: '4', ram: '3', gpu: '0' }),
        artistGenreVideo: new Questionnaire(12, 'Video', "What's important to you?", { cpu: '4', ram: '3', gpu: '1' }),
        artistGenrePhoto: new Questionnaire(13, 'Photo', "What's important to you?", { cpu: '3', ram: '2', gpu: '0' }),

        studentMajorSTEM: new Questionnaire(14, 'Science/Technology/Math', "What's important to you?", { cpu: '3', ram: '2', gpu: '1' }),
        studentMajorTrade: new Questionnaire(15, 'Trade School', "What's important to you?", { cpu: '1', ram: '1', gpu: '0' }),
        studentMajorLibArts: new Questionnaire(16, 'Liberal Arts', "What's important to you?", { cpu: '2', ram: '2', gpu: '0' }),
        studentMajorSports: new Questionnaire(17, 'Sports', "What's important to you?", { cpu: '1', ram: '2', gpu: '0' }),

        price: new Questionnaire(18, 'Price', '', { price: '1' }),
        speed: new Questionnaire(19, 'Speed', '', { cpu: '3', ram: '2', gpu: '0', hdd: '4', price: '5' }),
        graphics: new Questionnaire(20, 'Graphics', '', { gpu: '5', price: '4' }),
        space: new Questionnaire(21, 'Space', '', { hdd: '5', price: '3' }),
        rounded: new Questionnaire(22, 'Well-Rounded', '', { cpu: '2', ram: '2', gpu: '2', hdd: '2', price: '2' })
    };

    /**
     * QuestionStack Stack Constructor
     * @param {[Questionnaire]} rootNode [The root node of the question tree (should be 'home' node - ID: 1)]
     * @param {[Object]}        filters  [Filters to load - can retrieve filters from Cart entry in DB]
     */
    function QuestionStack(rootNode, filters) {
        this.stack = [];
        this.displayed = [];
        this.selected = [];
        this.currentFilters = Object.assign({}, defaultFilters, filters);
        this.rootNode = rootNode;
    }

    QuestionStack.prototype.add = function (nodes) {
        var _this = this;

        if (Array.isArray(nodes)) {
            nodes.forEach(function (node) {
                return _this.stack.push(node);
            });
        } else {
            this.stack.push(nodes);
        }
    };

    QuestionStack.prototype.assign = function (obj) {
        var _this2 = this;

        var keys = Object.keys(obj);
        keys.forEach(function (key) {
            if (_this2.currentFilters.hasOwnProperty(key)) {
                _this2.currentFilters[key].push(obj[key]);
            }
        });
    };

    QuestionStack.prototype.advance = function () {
        var _this3 = this;

        this.selected = this.displayed.filter(function (node) {
            return node.selected;
        });
        this.selected.forEach(function (node) {
            node.selected = false;
            if (node.answers.length) _this3.add(node);
            _this3.assign(node.filters);
        });
        var nextNode = this.stack.length > 0 ? this.stack.pop() : null;
        this.displayed = nextNode ? nextNode.answers : [];
        return nextNode;
    };

    QuestionStack.prototype.setStack = function (obj) {
        var filters = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        if (Array.isArray(obj)) this.stack = obj;else this.stack = [obj];
        this.displayed = obj.answers;
        this.assign(filters);
    };

    QuestionStack.prototype.findNodeById = function (node, id) {
        if (!node) node = this.rootNode;
        if (node.id === id) this.setStack(node);else node.answers.forEach(function (answer) {
            return Questionnaire.findNodeById(answer, id);
        });
    };

    /**
     * Initializes tree structure/associations for questionnaire.
     * @return {[undefined]} [Nothing returned]
     */
    QuestionStack.prototype.initialize = function () {
        questions.home.addAnswer(questions.desktop);
        questions.home.addAnswer(questions.laptop);

        questions.desktop.addAnswer(questions.gamer).addAnswer(questions.artist).addAnswer(questions.student).addAnswer(questions.casual);

        questions.laptop.addAnswer(questions.gamer).addAnswer(questions.artist).addAnswer(questions.student).addAnswer(questions.casual);

        questions.gamer.addAnswer(questions.gamerGenreRTS).addAnswer(questions.gamerGenreINDIE).addAnswer(questions.gamerGenreFPS).addAnswer(questions.gamerGenreRPG);

        questions.gamer.chainAnswer(questions.price).chainAnswer(questions.speed).chainAnswer(questions.graphics).chainAnswer(questions.space).chainAnswer(questions.rounded);

        questions.artist.addAnswer(questions.artistGenrePhoto).addAnswer(questions.artistGenreAudio).addAnswer(questions.artistGenreVideo);

        questions.artist.chainAnswer(questions.price).chainAnswer(questions.speed).chainAnswer(questions.graphics).chainAnswer(questions.space).chainAnswer(questions.rounded);

        questions.student.addAnswer(questions.studentMajorSTEM).addAnswer(questions.studentMajorTrade).addAnswer(questions.studentMajorSports).addAnswer(questions.studentMajorLibArts);
        questions.student.chainAnswer(questions.price).chainAnswer(questions.speed).chainAnswer(questions.graphics).chainAnswer(questions.space).chainAnswer(questions.rounded);

        questions.casual.addAnswer(questions.price).addAnswer(questions.speed).addAnswer(questions.graphics).addAnswer(questions.space).addAnswer(questions.rounded);

        this.setStack(this.rootNode);

        return this;
    };

    return new QuestionStack(questions.home);
});

app.factory('QTreeFactory', function () {

    /**
        * Questionnaire Tree Constructor
        * @param {[Number]} id         [Integer key for the node (enables lookup)]
        * @param {[String]} label      [Descriptor to display on selector element]
        * @param {[String]} question   [Question to display to user (answer selectors are in this.answers)]
        * @param {[Object]} filtersObj [Filters to apply based on answer choice]
        */
    function Questionnaire(id, label, question, filtersObj) {
        this.id = id;
        this.question = question;
        this.label = label;
        this.filters = filtersObj;
        this.answers = [];
        this.parent = null;
        this.selected = false;
    }

    Questionnaire.prototype.addAnswer = function (node) {
        node.parent = this;
        this.answers.push(node);
        return this;
    };

    Questionnaire.prototype.chainAnswer = function (node) {
        this.answers.forEach(function (answer) {
            answer.addAnswer(node);
        });
        return this;
    };

    Questionnaire.prototype.selectNode = function () {
        this.selected = !this.selected;
        console.log(this.label, this.selected ? 'on' : 'off');
    };

    return Questionnaire;
});

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html'
    });
});

(function () {

    'use strict';

    // Hope you didn't forget Angular! Duh-doy.

    if (!window.angular) throw new Error('I can\'t find Angular!');

    var app = angular.module('fsaPreBuilt', []);

    app.factory('Socket', function () {
        if (!window.io) throw new Error('socket.io not found!');
        return window.io(window.location.origin);
    });

    // AUTH_EVENTS is used throughout our app to
    // broadcast and listen from and to the $rootScope
    // for important events about authentication flow.
    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        var statusDict = {
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
        };
        return {
            responseError: function responseError(response) {
                $rootScope.$broadcast(statusDict[response.status], response);
                return $q.reject(response);
            }
        };
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push(['$injector', function ($injector) {
            return $injector.get('AuthInterceptor');
        }]);
    });

    app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q) {

        function onSuccessfulLogin(response) {
            var user = response.data.user;
            Session.create(user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            return user;
        }

        // Uses the session factory to see if an
        // authenticated user is currently registered.
        this.isAuthenticated = function () {
            return !!Session.user;
        };

        this.getLoggedInUser = function (fromServer) {

            // If an authenticated session exists, we
            // return the user attached to that session
            // with a promise. This ensures that we can
            // always interface with this method asynchronously.

            // Optionally, if true is given as the fromServer parameter,
            // then this cached value will not be used.

            if (this.isAuthenticated() && fromServer !== true) {
                return $q.when(Session.user);
            }

            // Make request GET /session.
            // If it returns a user, call onSuccessfulLogin with the response.
            // If it returns a 401 response, we catch it and instead resolve to null.
            return $http.get('/session').then(onSuccessfulLogin).catch(function () {
                return null;
            });
        };

        this.login = function (credentials) {
            return $http.post('/login', credentials).then(onSuccessfulLogin).catch(function () {
                return $q.reject({ message: 'Invalid login credentials.' });
            });
        };

        this.logout = function () {
            return $http.get('/logout').then(function () {
                Session.destroy();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        };
    });

    app.service('Session', function ($rootScope, AUTH_EVENTS) {

        var self = this;

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
            self.destroy();
        });

        $rootScope.$on(AUTH_EVENTS.sessionTimeout, function () {
            self.destroy();
        });

        this.user = null;

        this.create = function (sessionId, user) {
            this.user = user;
        };

        this.destroy = function () {
            this.user = null;
        };
    });
})();

app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });
});

app.controller('LoginCtrl', function ($scope, AuthService, $state) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function () {
            $state.go('home');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });
    };
});

app.config(function ($stateProvider) {

    $stateProvider.state('membersOnly', {
        url: '/members-area',
        template: '<img ng-repeat="item in stash" width="300" ng-src="{{ item }}" />',
        controller: function controller($scope, SecretStash) {
            SecretStash.getStash().then(function (stash) {
                $scope.stash = stash;
            });
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });
});

app.factory('SecretStash', function ($http) {

    var getStash = function getStash() {
        return $http.get('/api/members/secret-stash').then(function (response) {
            return response.data;
        });
    };

    return {
        getStash: getStash
    };
});

app.config(function ($stateProvider) {

    $stateProvider.state('questions', {
        url: '/discovery',
        templateUrl: 'js/questions/questions.html',
        controller: 'QuestionCtrl'
    });
});

app.controller('QuestionCtrl', function ($scope, AuthService, QStackFactory) {
    $scope.qstack = QStackFactory.initialize();
    $scope.current = $scope.qstack.advance();
    $scope.selected = new Map($scope.qstack.displayed.map(function (node) {
        return [node, false];
    }));

    $scope.select = function (node) {
        $scope.selected.set(node, !$scope.selected.get(node));
        return node.selectNode();
    };
    $scope.advance = function () {
        if ([].concat(_toConsumableArray($scope.selected.values())).every(function (value) {
            return value === false;
        })) return;
        $scope.current = $scope.qstack.advance();
        $scope.selected.clear();
        $scope.selected = new Map($scope.qstack.displayed.map(function (node) {
            return [node, false];
        }));
    };
});

app.factory('FullstackPics', function () {
    return ['https://pbs.twimg.com/media/B7gBXulCAAAXQcE.jpg:large', 'https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xap1/t31.0-8/10862451_10205622990359241_8027168843312841137_o.jpg', 'https://pbs.twimg.com/media/B-LKUshIgAEy9SK.jpg', 'https://pbs.twimg.com/media/B79-X7oCMAAkw7y.jpg', 'https://pbs.twimg.com/media/B-Uj9COIIAIFAh0.jpg:large', 'https://pbs.twimg.com/media/B6yIyFiCEAAql12.jpg:large', 'https://pbs.twimg.com/media/CE-T75lWAAAmqqJ.jpg:large', 'https://pbs.twimg.com/media/CEvZAg-VAAAk932.jpg:large', 'https://pbs.twimg.com/media/CEgNMeOXIAIfDhK.jpg:large', 'https://pbs.twimg.com/media/CEQyIDNWgAAu60B.jpg:large', 'https://pbs.twimg.com/media/CCF3T5QW8AE2lGJ.jpg:large', 'https://pbs.twimg.com/media/CAeVw5SWoAAALsj.jpg:large', 'https://pbs.twimg.com/media/CAaJIP7UkAAlIGs.jpg:large', 'https://pbs.twimg.com/media/CAQOw9lWEAAY9Fl.jpg:large', 'https://pbs.twimg.com/media/B-OQbVrCMAANwIM.jpg:large', 'https://pbs.twimg.com/media/B9b_erwCYAAwRcJ.png:large', 'https://pbs.twimg.com/media/B5PTdvnCcAEAl4x.jpg:large', 'https://pbs.twimg.com/media/B4qwC0iCYAAlPGh.jpg:large', 'https://pbs.twimg.com/media/B2b33vRIUAA9o1D.jpg:large', 'https://pbs.twimg.com/media/BwpIwr1IUAAvO2_.jpg:large', 'https://pbs.twimg.com/media/BsSseANCYAEOhLw.jpg:large', 'https://pbs.twimg.com/media/CJ4vLfuUwAAda4L.jpg:large', 'https://pbs.twimg.com/media/CI7wzjEVEAAOPpS.jpg:large', 'https://pbs.twimg.com/media/CIdHvT2UsAAnnHV.jpg:large', 'https://pbs.twimg.com/media/CGCiP_YWYAAo75V.jpg:large', 'https://pbs.twimg.com/media/CIS4JPIWIAI37qu.jpg:large'];
});

app.factory('RandomGreetings', function () {

    var getRandomFromArray = function getRandomFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    var greetings = ['Hello, world!', 'At long last, I live!', 'Hello, simple human.', 'What a beautiful day!', 'I\'m like any other project, except that I am yours. :)', 'This empty string is for Lindsay Levine.', 'こんにちは、ユーザー様。', 'Welcome. To. WEBSITE.', ':D', 'Yes, I think we\'ve met before.', 'Gimme 3 mins... I just grabbed this really dope frittata', 'If Cooper could offer only one piece of advice, it would be to nevSQUIRREL!'];

    return {
        greetings: greetings,
        getRandomGreeting: function getRandomGreeting() {
            return getRandomFromArray(greetings);
        }
    };
});

app.directive('fullstackLogo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/fullstack-logo/fullstack-logo.html'
    };
});

app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function link(scope) {

            scope.items = [{ label: 'Home', state: 'home' }, { label: 'About', state: 'about' }, { label: 'Documentation', state: 'docs' }, { label: 'Members Only', state: 'membersOnly', auth: true }];

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                    $state.go('home');
                });
            };

            var setUser = function setUser() {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function removeUser() {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
        }

    };
});

app.directive('randoGreeting', function (RandomGreetings) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/rando-greeting/rando-greeting.html',
        link: function link(scope) {
            scope.greeting = RandomGreetings.getRandomGreeting();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiZG9jcy9kb2NzLmpzIiwiZmFjdG9yaWVzL3FzdGFjay5mYWN0b3J5LmpzIiwiZmFjdG9yaWVzL3F0cmVlLmZhY3RvcnkuanMiLCJob21lL2hvbWUuanMiLCJmc2EvZnNhLXByZS1idWlsdC5qcyIsImxvZ2luL2xvZ2luLmpzIiwibWVtYmVycy1vbmx5L21lbWJlcnMtb25seS5qcyIsInF1ZXN0aW9ucy9xdWVzdGlvbi5qcyIsImNvbW1vbi9mYWN0b3JpZXMvRnVsbHN0YWNrUGljcy5qcyIsImNvbW1vbi9mYWN0b3JpZXMvUmFuZG9tR3JlZXRpbmdzLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvZnVsbHN0YWNrLWxvZ28vZnVsbHN0YWNrLWxvZ28uanMiLCJjb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2YmFyLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvcmFuZG8tZ3JlZXRpbmcvcmFuZG8tZ3JlZXRpbmcuanMiXSwibmFtZXMiOlsid2luZG93IiwiYXBwIiwiYW5ndWxhciIsIm1vZHVsZSIsImNvbmZpZyIsIiR1cmxSb3V0ZXJQcm92aWRlciIsIiRsb2NhdGlvblByb3ZpZGVyIiwiaHRtbDVNb2RlIiwib3RoZXJ3aXNlIiwid2hlbiIsImxvY2F0aW9uIiwicmVsb2FkIiwicnVuIiwiJHJvb3RTY29wZSIsIkF1dGhTZXJ2aWNlIiwiJHN0YXRlIiwiZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCIsInN0YXRlIiwiZGF0YSIsImF1dGhlbnRpY2F0ZSIsIiRvbiIsImV2ZW50IiwidG9TdGF0ZSIsInRvUGFyYW1zIiwiaXNBdXRoZW50aWNhdGVkIiwicHJldmVudERlZmF1bHQiLCJnZXRMb2dnZWRJblVzZXIiLCJ0aGVuIiwidXNlciIsImdvIiwibmFtZSIsIiRzdGF0ZVByb3ZpZGVyIiwidXJsIiwiY29udHJvbGxlciIsInRlbXBsYXRlVXJsIiwiJHNjb3BlIiwiRnVsbHN0YWNrUGljcyIsImltYWdlcyIsIl8iLCJzaHVmZmxlIiwiZmFjdG9yeSIsIiRodHRwIiwiUVRyZWVGYWN0b3J5IiwiZGVmYXVsdEZpbHRlcnMiLCJjb21wdXRlciIsInR5cGUiLCJwcmljZSIsInByaW9yaXR5IiwicHJvY2Vzc29yIiwicmFtIiwiaGRkIiwiY3B1IiwiZ3B1IiwiUXVlc3Rpb25uYWlyZSIsImJpbmQiLCJxdWVzdGlvbnMiLCJob21lIiwiZGVza3RvcCIsImxhcHRvcCIsImdhbWVyIiwiYXJ0aXN0Iiwic3R1ZGVudCIsImNhc3VhbCIsImdhbWVyR2VucmVSVFMiLCJnYW1lckdlbnJlUlBHIiwiZ2FtZXJHZW5yZUZQUyIsImdhbWVyR2VucmVJTkRJRSIsImFydGlzdEdlbnJlQXVkaW8iLCJhcnRpc3RHZW5yZVZpZGVvIiwiYXJ0aXN0R2VucmVQaG90byIsInN0dWRlbnRNYWpvclNURU0iLCJzdHVkZW50TWFqb3JUcmFkZSIsInN0dWRlbnRNYWpvckxpYkFydHMiLCJzdHVkZW50TWFqb3JTcG9ydHMiLCJzcGVlZCIsImdyYXBoaWNzIiwic3BhY2UiLCJyb3VuZGVkIiwiUXVlc3Rpb25TdGFjayIsInJvb3ROb2RlIiwiZmlsdGVycyIsInN0YWNrIiwiZGlzcGxheWVkIiwic2VsZWN0ZWQiLCJjdXJyZW50RmlsdGVycyIsIk9iamVjdCIsImFzc2lnbiIsInByb3RvdHlwZSIsImFkZCIsIm5vZGVzIiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsInB1c2giLCJub2RlIiwib2JqIiwia2V5cyIsImhhc093blByb3BlcnR5Iiwia2V5IiwiYWR2YW5jZSIsImZpbHRlciIsImFuc3dlcnMiLCJsZW5ndGgiLCJuZXh0Tm9kZSIsInBvcCIsInNldFN0YWNrIiwiZmluZE5vZGVCeUlkIiwiaWQiLCJhbnN3ZXIiLCJpbml0aWFsaXplIiwiYWRkQW5zd2VyIiwiY2hhaW5BbnN3ZXIiLCJsYWJlbCIsInF1ZXN0aW9uIiwiZmlsdGVyc09iaiIsInBhcmVudCIsInNlbGVjdE5vZGUiLCJjb25zb2xlIiwibG9nIiwiRXJyb3IiLCJpbyIsIm9yaWdpbiIsImNvbnN0YW50IiwibG9naW5TdWNjZXNzIiwibG9naW5GYWlsZWQiLCJsb2dvdXRTdWNjZXNzIiwic2Vzc2lvblRpbWVvdXQiLCJub3RBdXRoZW50aWNhdGVkIiwibm90QXV0aG9yaXplZCIsIiRxIiwiQVVUSF9FVkVOVFMiLCJzdGF0dXNEaWN0IiwicmVzcG9uc2VFcnJvciIsInJlc3BvbnNlIiwiJGJyb2FkY2FzdCIsInN0YXR1cyIsInJlamVjdCIsIiRodHRwUHJvdmlkZXIiLCJpbnRlcmNlcHRvcnMiLCIkaW5qZWN0b3IiLCJnZXQiLCJzZXJ2aWNlIiwiU2Vzc2lvbiIsIm9uU3VjY2Vzc2Z1bExvZ2luIiwiY3JlYXRlIiwiZnJvbVNlcnZlciIsImNhdGNoIiwibG9naW4iLCJjcmVkZW50aWFscyIsInBvc3QiLCJtZXNzYWdlIiwibG9nb3V0IiwiZGVzdHJveSIsInNlbGYiLCJzZXNzaW9uSWQiLCJlcnJvciIsInNlbmRMb2dpbiIsImxvZ2luSW5mbyIsInRlbXBsYXRlIiwiU2VjcmV0U3Rhc2giLCJnZXRTdGFzaCIsInN0YXNoIiwiUVN0YWNrRmFjdG9yeSIsInFzdGFjayIsImN1cnJlbnQiLCJNYXAiLCJtYXAiLCJzZWxlY3QiLCJzZXQiLCJ2YWx1ZXMiLCJldmVyeSIsInZhbHVlIiwiY2xlYXIiLCJnZXRSYW5kb21Gcm9tQXJyYXkiLCJhcnIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJncmVldGluZ3MiLCJnZXRSYW5kb21HcmVldGluZyIsImRpcmVjdGl2ZSIsInJlc3RyaWN0Iiwic2NvcGUiLCJsaW5rIiwiaXRlbXMiLCJhdXRoIiwiaXNMb2dnZWRJbiIsInNldFVzZXIiLCJyZW1vdmVVc2VyIiwiUmFuZG9tR3JlZXRpbmdzIiwiZ3JlZXRpbmciXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBQ0FBLE9BQUFDLEdBQUEsR0FBQUMsUUFBQUMsTUFBQSxDQUFBLHVCQUFBLEVBQUEsQ0FBQSxhQUFBLEVBQUEsV0FBQSxFQUFBLGNBQUEsRUFBQSxXQUFBLENBQUEsQ0FBQTs7QUFFQUYs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QUFBLENBQUEsWUFBQTtBQUNBWiwyQkFBQWMsRUFBQSxDQUFBLE1BQUE7QUFDQSxpQkFGQTtBQUdBLGFBSkE7O0FBTUEsZ0JBQUE4SixVQUFBLFNBQUFBLE9BQUEsR0FBQTtBQUNBN0ssNEJBQUFZLGVBQUEsR0FBQUMsSUFBQSxDQUFBLFVBQUFDLElBQUEsRUFBQTtBQUNBMEosMEJBQUExSixJQUFBLEdBQUFBLElBQUE7QUFDQSxpQkFGQTtBQUdBLGFBSkE7O0FBTUEsZ0JBQUFnSyxhQUFBLFNBQUFBLFVBQUEsR0FBQTtBQUNBTixzQkFBQTFKLElBQUEsR0FBQSxJQUFBO0FBQ0EsYUFGQTs7QUFJQStKOztBQUVBOUssdUJBQUFPLEdBQUEsQ0FBQThHLFlBQUFQLFlBQUEsRUFBQWdFLE9BQUE7QUFDQTlLLHVCQUFBTyxHQUFBLENBQUE4RyxZQUFBTCxhQUFBLEVBQUErRCxVQUFBO0FBQ0EvSyx1QkFBQU8sR0FBQSxDQUFBOEcsWUFBQUosY0FBQSxFQUFBOEQsVUFBQTtBQUVBOztBQXpDQSxLQUFBO0FBNkNBLENBL0NBOztBQ0FBM0wsSUFBQW1MLFNBQUEsQ0FBQSxlQUFBLEVBQUEsVUFBQVMsZUFBQSxFQUFBOztBQUVBLFdBQUE7QUFDQVIsa0JBQUEsR0FEQTtBQUVBbkoscUJBQUEseURBRkE7QUFHQXFKLGNBQUEsY0FBQUQsS0FBQSxFQUFBO0FBQ0FBLGtCQUFBUSxRQUFBLEdBQUFELGdCQUFBVixpQkFBQSxFQUFBO0FBQ0E7QUFMQSxLQUFBO0FBUUEsQ0FWQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xud2luZG93LmFwcCA9IGFuZ3VsYXIubW9kdWxlKCdGdWxsc3RhY2tHZW5lcmF0ZWRBcHAnLCBbJ2ZzYVByZUJ1aWx0JywgJ3VpLnJvdXRlcicsICd1aS5ib290c3RyYXAnLCAnbmdBbmltYXRlJ10pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgLy8gVGhpcyB0dXJucyBvZmYgaGFzaGJhbmcgdXJscyAoLyNhYm91dCkgYW5kIGNoYW5nZXMgaXQgdG8gc29tZXRoaW5nIG5vcm1hbCAoL2Fib3V0KVxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAvLyBJZiB3ZSBnbyB0byBhIFVSTCB0aGF0IHVpLXJvdXRlciBkb2Vzbid0IGhhdmUgcmVnaXN0ZXJlZCwgZ28gdG8gdGhlIFwiL1wiIHVybC5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG4gICAgLy8gVHJpZ2dlciBwYWdlIHJlZnJlc2ggd2hlbiBhY2Nlc3NpbmcgYW4gT0F1dGggcm91dGVcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignL2F1dGgvOnByb3ZpZGVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG59KTtcblxuLy8gVGhpcyBhcHAucnVuIGlzIGZvciBjb250cm9sbGluZyBhY2Nlc3MgdG8gc3BlY2lmaWMgc3RhdGVzLlxuYXBwLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgQXV0aFNlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgLy8gVGhlIGdpdmVuIHN0YXRlIHJlcXVpcmVzIGFuIGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgICB2YXIgZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICByZXR1cm4gc3RhdGUuZGF0YSAmJiBzdGF0ZS5kYXRhLmF1dGhlbnRpY2F0ZTtcbiAgICB9O1xuXG4gICAgLy8gJHN0YXRlQ2hhbmdlU3RhcnQgaXMgYW4gZXZlbnQgZmlyZWRcbiAgICAvLyB3aGVuZXZlciB0aGUgcHJvY2VzcyBvZiBjaGFuZ2luZyBhIHN0YXRlIGJlZ2lucy5cbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zKSB7XG5cbiAgICAgICAgaWYgKCFkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoKHRvU3RhdGUpKSB7XG4gICAgICAgICAgICAvLyBUaGUgZGVzdGluYXRpb24gc3RhdGUgZG9lcyBub3QgcmVxdWlyZSBhdXRoZW50aWNhdGlvblxuICAgICAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCB3aXRoIHJldHVybi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgLy8gVGhlIHVzZXIgaXMgYXV0aGVudGljYXRlZC5cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDYW5jZWwgbmF2aWdhdGluZyB0byBuZXcgc3RhdGUuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgQXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgLy8gSWYgYSB1c2VyIGlzIHJldHJpZXZlZCwgdGhlbiByZW5hdmlnYXRlIHRvIHRoZSBkZXN0aW5hdGlvblxuICAgICAgICAgICAgLy8gKHRoZSBzZWNvbmQgdGltZSwgQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkgd2lsbCB3b3JrKVxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBpZiBubyB1c2VyIGlzIGxvZ2dlZCBpbiwgZ28gdG8gXCJsb2dpblwiIHN0YXRlLlxuICAgICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28odG9TdGF0ZS5uYW1lLCB0b1BhcmFtcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2Fib3V0Jywge1xuICAgICAgICB1cmw6ICcvYWJvdXQnLFxuICAgICAgICBjb250cm9sbGVyOiAnQWJvdXRDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hYm91dC9hYm91dC5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0Fib3V0Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEZ1bGxzdGFja1BpY3MpIHtcblxuICAgIC8vIEltYWdlcyBvZiBiZWF1dGlmdWwgRnVsbHN0YWNrIHBlb3BsZS5cbiAgICAkc2NvcGUuaW1hZ2VzID0gXy5zaHVmZmxlKEZ1bGxzdGFja1BpY3MpO1xuXG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2RvY3MnLCB7XG4gICAgICAgIHVybDogJy9kb2NzJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9kb2NzL2RvY3MuaHRtbCdcbiAgICB9KTtcbn0pO1xuIiwiYXBwLmZhY3RvcnkoJ1FTdGFja0ZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCwgUVRyZWVGYWN0b3J5KSB7XG5cbiAgICBsZXQgZGVmYXVsdEZpbHRlcnMgPSB7XG4gICAgICAgIGNvbXB1dGVyOiBbXSxcbiAgICAgICAgdHlwZTogW10sXG4gICAgICAgIHByaWNlOiBbXSxcbiAgICAgICAgcHJpb3JpdHk6IFtdLFxuICAgICAgICBwcm9jZXNzb3I6IFtdLFxuICAgICAgICByYW06IFtdLFxuICAgICAgICBoZGQ6IFtdLFxuICAgICAgICBjcHU6IFtdLFxuICAgICAgICBncHU6IFtdXG4gICAgfTtcblxuICAgIGxldCBRdWVzdGlvbm5haXJlID0gUVRyZWVGYWN0b3J5LmJpbmQoUVRyZWVGYWN0b3J5KTtcblxuICAgIC8vIFByb2JhYmx5IHNob3VsZCBtb3ZlIHRvIGEgZGF0YWJhc2UgYXQgc29tZSBwb2ludCBpbiB0aGUgZnV0dXJlIHRpbWVsaW5lLi4uXG4gICAgbGV0IHF1ZXN0aW9ucyA9IHtcbiAgICAgICAgaG9tZTogbmV3IFF1ZXN0aW9ubmFpcmUoMCwgJ0hvbWUnLCAnV2hpY2ggdHlwZSBvZiBjb21wdXRlciBhcmUgeW91IGxvb2tpbmcgZm9yPycsIHt9KSxcbiAgICAgICAgZGVza3RvcDogbmV3IFF1ZXN0aW9ubmFpcmUoMSwgJ0Rlc2t0b3AnLCAnV2hpY2ggdHlwZSBvZiB1c2VyIGFyZSB5b3U/JywgeyBjb21wdXRlcjogJ2Rlc2t0b3AnIH0pLFxuICAgICAgICBsYXB0b3A6IG5ldyBRdWVzdGlvbm5haXJlKDIsICdMYXB0b3AnLCAnV2hpY2ggdHlwZSBvZiB1c2VyIGFyZSB5b3U/JywgeyBjb21wdXRlcjogJ2xhcHRvcCcgfSksXG4gICAgICAgIGdhbWVyOiBuZXcgUXVlc3Rpb25uYWlyZSgzLCAnR2FtZXInLCAnU2VsZWN0IHlvdXIgZmF2b3JpdGUgZ2VucmVzJywgeyB0eXBlOiAnZ2FtZXInIH0pLFxuICAgICAgICBhcnRpc3Q6IG5ldyBRdWVzdGlvbm5haXJlKDQsICdBcnRpc3QnLCAnRG8geW91IHdvcmsgd2l0aCBhdWRpbz8gVmlkZW8/IE1vcmUgY3JlYXRpdmUgbWVkaWE/JywgeyB0eXBlOiAnYXJ0aXN0JyB9KSxcbiAgICAgICAgc3R1ZGVudDogbmV3IFF1ZXN0aW9ubmFpcmUoNSwgJ1N0dWRlbnQnLCAnV2hhdCBhcmUgeW91IHN0dWR5aW5nPycsIHsgdHlwZTogJ3N0dWRlbnQnIH0pLFxuICAgICAgICBjYXN1YWw6IG5ldyBRdWVzdGlvbm5haXJlKDYsICdDYXN1YWwnLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IHR5cGU6ICdjYXN1YWwnIH0pLFxuXG4gICAgICAgIGdhbWVyR2VucmVSVFM6IG5ldyBRdWVzdGlvbm5haXJlKDcsICdTdHJhdGVneScsIFwiV2hhdCdzIGltcG9ydGFudCB0byB5b3U/XCIsIHsgY3B1OiAnNCcsIHJhbTogJzQnLCBncHU6ICcyJyB9KSxcbiAgICAgICAgZ2FtZXJHZW5yZVJQRzogbmV3IFF1ZXN0aW9ubmFpcmUoOCwgJ1JvbGUgUGxheWluZyBHYW1lcycsIFwiV2hhdCdzIGltcG9ydGFudCB0byB5b3U/XCIsIHsgY3B1OiAnNCcsIHJhbTogJzMnLCBncHU6ICc0JyB9KSxcbiAgICAgICAgZ2FtZXJHZW5yZUZQUzogbmV3IFF1ZXN0aW9ubmFpcmUoOSwgJ0ZQUy9BY3Rpb24nLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IGNwdTogJzQnLCByYW06ICczJywgZ3B1OiAnNCcgfSksXG4gICAgICAgIGdhbWVyR2VucmVJTkRJRTogbmV3IFF1ZXN0aW9ubmFpcmUoMTAsICdJbmRpZScsIFwiV2hhdCdzIGltcG9ydGFudCB0byB5b3U/XCIsIHsgY3B1OiAnMicsIHJhbTogJzInLCBncHU6ICcyJyB9KSxcblxuICAgICAgICBhcnRpc3RHZW5yZUF1ZGlvOiBuZXcgUXVlc3Rpb25uYWlyZSgxMSwgJ0F1ZGlvJywgXCJXaGF0J3MgaW1wb3J0YW50IHRvIHlvdT9cIiwgeyBjcHU6ICc0JywgcmFtOiAnMycsIGdwdTogJzAnIH0pLFxuICAgICAgICBhcnRpc3RHZW5yZVZpZGVvOiBuZXcgUXVlc3Rpb25uYWlyZSgxMiwgJ1ZpZGVvJywgXCJXaGF0J3MgaW1wb3J0YW50IHRvIHlvdT9cIiwgeyBjcHU6ICc0JywgcmFtOiAnMycsIGdwdTogJzEnIH0pLFxuICAgICAgICBhcnRpc3RHZW5yZVBob3RvOiBuZXcgUXVlc3Rpb25uYWlyZSgxMywgJ1Bob3RvJywgXCJXaGF0J3MgaW1wb3J0YW50IHRvIHlvdT9cIiwgeyBjcHU6ICczJywgcmFtOiAnMicsIGdwdTogJzAnIH0pLFxuXG4gICAgICAgIHN0dWRlbnRNYWpvclNURU06IG5ldyBRdWVzdGlvbm5haXJlKDE0LCAnU2NpZW5jZS9UZWNobm9sb2d5L01hdGgnLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IGNwdTogJzMnLCByYW06ICcyJywgZ3B1OiAnMScgfSksXG4gICAgICAgIHN0dWRlbnRNYWpvclRyYWRlOiBuZXcgUXVlc3Rpb25uYWlyZSgxNSwgJ1RyYWRlIFNjaG9vbCcsIFwiV2hhdCdzIGltcG9ydGFudCB0byB5b3U/XCIsIHsgY3B1OiAnMScsIHJhbTogJzEnLCBncHU6ICcwJyB9KSxcbiAgICAgICAgc3R1ZGVudE1ham9yTGliQXJ0czogbmV3IFF1ZXN0aW9ubmFpcmUoMTYsICdMaWJlcmFsIEFydHMnLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IGNwdTogJzInLCByYW06ICcyJywgZ3B1OiAnMCcgfSksXG4gICAgICAgIHN0dWRlbnRNYWpvclNwb3J0czogbmV3IFF1ZXN0aW9ubmFpcmUoMTcsICdTcG9ydHMnLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IGNwdTogJzEnLCByYW06ICcyJywgZ3B1OiAnMCcgfSksXG5cbiAgICAgICAgcHJpY2U6IG5ldyBRdWVzdGlvbm5haXJlKDE4LCAnUHJpY2UnLCAnJywgeyBwcmljZTogJzEnIH0pLFxuICAgICAgICBzcGVlZDogbmV3IFF1ZXN0aW9ubmFpcmUoMTksICdTcGVlZCcsICcnLCB7IGNwdTogJzMnLCByYW06ICcyJywgZ3B1OiAnMCcsIGhkZDogJzQnLCBwcmljZTogJzUnIH0pLFxuICAgICAgICBncmFwaGljczogbmV3IFF1ZXN0aW9ubmFpcmUoMjAsICdHcmFwaGljcycsICcnLCB7IGdwdTogJzUnLCBwcmljZTogJzQnIH0pLFxuICAgICAgICBzcGFjZTogbmV3IFF1ZXN0aW9ubmFpcmUoMjEsICdTcGFjZScsICcnLCB7IGhkZDogJzUnLCBwcmljZTogJzMnIH0pLFxuICAgICAgICByb3VuZGVkOiBuZXcgUXVlc3Rpb25uYWlyZSgyMiwgJ1dlbGwtUm91bmRlZCcsICcnLCB7IGNwdTogJzInLCByYW06ICcyJywgZ3B1OiAnMicsIGhkZDogJzInLCBwcmljZTogJzInIH0pLFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBRdWVzdGlvblN0YWNrIFN0YWNrIENvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtbUXVlc3Rpb25uYWlyZV19IHJvb3ROb2RlIFtUaGUgcm9vdCBub2RlIG9mIHRoZSBxdWVzdGlvbiB0cmVlIChzaG91bGQgYmUgJ2hvbWUnIG5vZGUgLSBJRDogMSldXG4gICAgICogQHBhcmFtIHtbT2JqZWN0XX0gICAgICAgIGZpbHRlcnMgIFtGaWx0ZXJzIHRvIGxvYWQgLSBjYW4gcmV0cmlldmUgZmlsdGVycyBmcm9tIENhcnQgZW50cnkgaW4gREJdXG4gICAgICovXG4gICAgZnVuY3Rpb24gUXVlc3Rpb25TdGFjayhyb290Tm9kZSwgZmlsdGVycykge1xuICAgICAgICB0aGlzLnN0YWNrID0gW107XG4gICAgICAgIHRoaXMuZGlzcGxheWVkID0gW107XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBbXTtcbiAgICAgICAgdGhpcy5jdXJyZW50RmlsdGVycyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRGaWx0ZXJzLCBmaWx0ZXJzKTtcbiAgICAgICAgdGhpcy5yb290Tm9kZSA9IHJvb3ROb2RlO1xuICAgIH1cblxuICAgIFF1ZXN0aW9uU3RhY2sucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG5vZGVzKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KG5vZGVzKSkge1xuICAgICAgICAgICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHRoaXMuc3RhY2sucHVzaChub2RlKSk7XG4gICAgICAgIH0gZWxzZSB7IHRoaXMuc3RhY2sucHVzaChub2Rlcyk7IH1cbiAgICB9XG5cbiAgICBRdWVzdGlvblN0YWNrLnByb3RvdHlwZS5hc3NpZ24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgICAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRGaWx0ZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRGaWx0ZXJzW2tleV0ucHVzaChvYmpba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgUXVlc3Rpb25TdGFjay5wcm90b3R5cGUuYWR2YW5jZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5kaXNwbGF5ZWQuZmlsdGVyKG5vZGUgPT4gbm9kZS5zZWxlY3RlZCk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgIG5vZGUuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChub2RlLmFuc3dlcnMubGVuZ3RoKSB0aGlzLmFkZChub2RlKTtcbiAgICAgICAgICAgIHRoaXMuYXNzaWduKG5vZGUuZmlsdGVycyk7XG4gICAgICAgIH0pXG4gICAgICAgIGxldCBuZXh0Tm9kZSA9IHRoaXMuc3RhY2subGVuZ3RoID4gMCA/IHRoaXMuc3RhY2sucG9wKCkgOiBudWxsO1xuICAgICAgICB0aGlzLmRpc3BsYXllZCA9IG5leHROb2RlID8gbmV4dE5vZGUuYW5zd2VycyA6IFtdO1xuICAgICAgICByZXR1cm4gbmV4dE5vZGU7XG4gICAgfVxuXG4gICAgUXVlc3Rpb25TdGFjay5wcm90b3R5cGUuc2V0U3RhY2sgPSBmdW5jdGlvbihvYmosIGZpbHRlcnMgPSB7fSkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB0aGlzLnN0YWNrID0gb2JqO1xuICAgICAgICBlbHNlIHRoaXMuc3RhY2sgPSBbb2JqXTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWQgPSBvYmouYW5zd2VycztcbiAgICAgICAgdGhpcy5hc3NpZ24oZmlsdGVycyk7XG4gICAgfVxuXG4gICAgUXVlc3Rpb25TdGFjay5wcm90b3R5cGUuZmluZE5vZGVCeUlkID0gZnVuY3Rpb24obm9kZSwgaWQpIHtcbiAgICAgICAgaWYgKCFub2RlKSBub2RlID0gdGhpcy5yb290Tm9kZTtcbiAgICAgICAgaWYgKG5vZGUuaWQgPT09IGlkKSB0aGlzLnNldFN0YWNrKG5vZGUpO1xuICAgICAgICBlbHNlIG5vZGUuYW5zd2Vycy5mb3JFYWNoKGFuc3dlciA9PiBRdWVzdGlvbm5haXJlLmZpbmROb2RlQnlJZChhbnN3ZXIsIGlkKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgdHJlZSBzdHJ1Y3R1cmUvYXNzb2NpYXRpb25zIGZvciBxdWVzdGlvbm5haXJlLlxuICAgICAqIEByZXR1cm4ge1t1bmRlZmluZWRdfSBbTm90aGluZyByZXR1cm5lZF1cbiAgICAgKi9cbiAgICBRdWVzdGlvblN0YWNrLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHF1ZXN0aW9ucy5ob21lLmFkZEFuc3dlcihxdWVzdGlvbnMuZGVza3RvcCk7XG4gICAgICAgIHF1ZXN0aW9ucy5ob21lLmFkZEFuc3dlcihxdWVzdGlvbnMubGFwdG9wKTtcblxuICAgICAgICBxdWVzdGlvbnMuZGVza3RvcFxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuZ2FtZXIpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5hcnRpc3QpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5zdHVkZW50KVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuY2FzdWFsKTtcblxuICAgICAgICBxdWVzdGlvbnMubGFwdG9wXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5nYW1lcilcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmFydGlzdClcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLnN0dWRlbnQpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5jYXN1YWwpO1xuXG4gICAgICAgIHF1ZXN0aW9ucy5nYW1lclxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuZ2FtZXJHZW5yZVJUUylcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmdhbWVyR2VucmVJTkRJRSlcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmdhbWVyR2VucmVGUFMpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5nYW1lckdlbnJlUlBHKTtcblxuICAgICAgICBxdWVzdGlvbnMuZ2FtZXJcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMucHJpY2UpXG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLnNwZWVkKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5ncmFwaGljcylcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMuc3BhY2UpXG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLnJvdW5kZWQpO1xuXG4gICAgICAgIHF1ZXN0aW9ucy5hcnRpc3RcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmFydGlzdEdlbnJlUGhvdG8pXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5hcnRpc3RHZW5yZUF1ZGlvKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuYXJ0aXN0R2VucmVWaWRlbyk7XG5cbiAgICAgICAgcXVlc3Rpb25zLmFydGlzdFxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5wcmljZSlcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMuc3BlZWQpXG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLmdyYXBoaWNzKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5zcGFjZSlcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMucm91bmRlZCk7XG5cbiAgICAgICAgcXVlc3Rpb25zLnN0dWRlbnRcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLnN0dWRlbnRNYWpvclNURU0pXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5zdHVkZW50TWFqb3JUcmFkZSlcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLnN0dWRlbnRNYWpvclNwb3J0cylcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLnN0dWRlbnRNYWpvckxpYkFydHMpO1xuICAgICAgICBxdWVzdGlvbnMuc3R1ZGVudFxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5wcmljZSlcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMuc3BlZWQpXG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLmdyYXBoaWNzKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5zcGFjZSlcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMucm91bmRlZCk7XG5cbiAgICAgICAgcXVlc3Rpb25zLmNhc3VhbFxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMucHJpY2UpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5zcGVlZClcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmdyYXBoaWNzKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuc3BhY2UpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5yb3VuZGVkKTtcblxuXG4gICAgICAgIHRoaXMuc2V0U3RhY2sodGhpcy5yb290Tm9kZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBRdWVzdGlvblN0YWNrKHF1ZXN0aW9ucy5ob21lKTtcblxufSk7XG4iLCJhcHAuZmFjdG9yeSgnUVRyZWVGYWN0b3J5JywgZnVuY3Rpb24oKSB7XG5cblx0LyoqXG4gICAgICogUXVlc3Rpb25uYWlyZSBUcmVlIENvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtbTnVtYmVyXX0gaWQgICAgICAgICBbSW50ZWdlciBrZXkgZm9yIHRoZSBub2RlIChlbmFibGVzIGxvb2t1cCldXG4gICAgICogQHBhcmFtIHtbU3RyaW5nXX0gbGFiZWwgICAgICBbRGVzY3JpcHRvciB0byBkaXNwbGF5IG9uIHNlbGVjdG9yIGVsZW1lbnRdXG4gICAgICogQHBhcmFtIHtbU3RyaW5nXX0gcXVlc3Rpb24gICBbUXVlc3Rpb24gdG8gZGlzcGxheSB0byB1c2VyIChhbnN3ZXIgc2VsZWN0b3JzIGFyZSBpbiB0aGlzLmFuc3dlcnMpXVxuICAgICAqIEBwYXJhbSB7W09iamVjdF19IGZpbHRlcnNPYmogW0ZpbHRlcnMgdG8gYXBwbHkgYmFzZWQgb24gYW5zd2VyIGNob2ljZV1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBRdWVzdGlvbm5haXJlKGlkLCBsYWJlbCwgcXVlc3Rpb24sIGZpbHRlcnNPYmopIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gcXVlc3Rpb247XG4gICAgICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gZmlsdGVyc09ialxuICAgICAgICB0aGlzLmFuc3dlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgUXVlc3Rpb25uYWlyZS5wcm90b3R5cGUuYWRkQW5zd2VyID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICBub2RlLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIHRoaXMuYW5zd2Vycy5wdXNoKG5vZGUpO1xuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIFF1ZXN0aW9ubmFpcmUucHJvdG90eXBlLmNoYWluQW5zd2VyID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICB0aGlzLmFuc3dlcnMuZm9yRWFjaChhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgYW5zd2VyLmFkZEFuc3dlcihub2RlKVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgUXVlc3Rpb25uYWlyZS5wcm90b3R5cGUuc2VsZWN0Tm9kZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gIXRoaXMuc2VsZWN0ZWQ7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMubGFiZWwsIHRoaXMuc2VsZWN0ZWQgPyAnb24nIDogJ29mZicpO1xuICAgIH1cblxuICAgIHJldHVybiBRdWVzdGlvbm5haXJlO1xuXG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgIHVybDogJy8nLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2hvbWUvaG9tZS5odG1sJ1xuICAgIH0pO1xufSk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gSG9wZSB5b3UgZGlkbid0IGZvcmdldCBBbmd1bGFyISBEdWgtZG95LlxuICAgIGlmICghd2luZG93LmFuZ3VsYXIpIHRocm93IG5ldyBFcnJvcignSSBjYW5cXCd0IGZpbmQgQW5ndWxhciEnKTtcblxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnZnNhUHJlQnVpbHQnLCBbXSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnU29ja2V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXdpbmRvdy5pbykgdGhyb3cgbmV3IEVycm9yKCdzb2NrZXQuaW8gbm90IGZvdW5kIScpO1xuICAgICAgICByZXR1cm4gd2luZG93LmlvKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pO1xuICAgIH0pO1xuXG4gICAgLy8gQVVUSF9FVkVOVFMgaXMgdXNlZCB0aHJvdWdob3V0IG91ciBhcHAgdG9cbiAgICAvLyBicm9hZGNhc3QgYW5kIGxpc3RlbiBmcm9tIGFuZCB0byB0aGUgJHJvb3RTY29wZVxuICAgIC8vIGZvciBpbXBvcnRhbnQgZXZlbnRzIGFib3V0IGF1dGhlbnRpY2F0aW9uIGZsb3cuXG4gICAgYXBwLmNvbnN0YW50KCdBVVRIX0VWRU5UUycsIHtcbiAgICAgICAgbG9naW5TdWNjZXNzOiAnYXV0aC1sb2dpbi1zdWNjZXNzJyxcbiAgICAgICAgbG9naW5GYWlsZWQ6ICdhdXRoLWxvZ2luLWZhaWxlZCcsXG4gICAgICAgIGxvZ291dFN1Y2Nlc3M6ICdhdXRoLWxvZ291dC1zdWNjZXNzJyxcbiAgICAgICAgc2Vzc2lvblRpbWVvdXQ6ICdhdXRoLXNlc3Npb24tdGltZW91dCcsXG4gICAgICAgIG5vdEF1dGhlbnRpY2F0ZWQ6ICdhdXRoLW5vdC1hdXRoZW50aWNhdGVkJyxcbiAgICAgICAgbm90QXV0aG9yaXplZDogJ2F1dGgtbm90LWF1dGhvcml6ZWQnXG4gICAgfSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRxLCBBVVRIX0VWRU5UUykge1xuICAgICAgICB2YXIgc3RhdHVzRGljdCA9IHtcbiAgICAgICAgICAgIDQwMTogQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCxcbiAgICAgICAgICAgIDQwMzogQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZCxcbiAgICAgICAgICAgIDQxOTogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsXG4gICAgICAgICAgICA0NDA6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3Qoc3RhdHVzRGljdFtyZXNwb25zZS5zdGF0dXNdLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGFwcC5jb25maWcoZnVuY3Rpb24gKCRodHRwUHJvdmlkZXIpIHtcbiAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChbXG4gICAgICAgICAgICAnJGluamVjdG9yJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGluamVjdG9yLmdldCgnQXV0aEludGVyY2VwdG9yJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgYXBwLnNlcnZpY2UoJ0F1dGhTZXJ2aWNlJywgZnVuY3Rpb24gKCRodHRwLCBTZXNzaW9uLCAkcm9vdFNjb3BlLCBBVVRIX0VWRU5UUywgJHEpIHtcblxuICAgICAgICBmdW5jdGlvbiBvblN1Y2Nlc3NmdWxMb2dpbihyZXNwb25zZSkge1xuICAgICAgICAgICAgdmFyIHVzZXIgPSByZXNwb25zZS5kYXRhLnVzZXI7XG4gICAgICAgICAgICBTZXNzaW9uLmNyZWF0ZSh1c2VyKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MpO1xuICAgICAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVc2VzIHRoZSBzZXNzaW9uIGZhY3RvcnkgdG8gc2VlIGlmIGFuXG4gICAgICAgIC8vIGF1dGhlbnRpY2F0ZWQgdXNlciBpcyBjdXJyZW50bHkgcmVnaXN0ZXJlZC5cbiAgICAgICAgdGhpcy5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gISFTZXNzaW9uLnVzZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5nZXRMb2dnZWRJblVzZXIgPSBmdW5jdGlvbiAoZnJvbVNlcnZlcikge1xuXG4gICAgICAgICAgICAvLyBJZiBhbiBhdXRoZW50aWNhdGVkIHNlc3Npb24gZXhpc3RzLCB3ZVxuICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSB1c2VyIGF0dGFjaGVkIHRvIHRoYXQgc2Vzc2lvblxuICAgICAgICAgICAgLy8gd2l0aCBhIHByb21pc2UuIFRoaXMgZW5zdXJlcyB0aGF0IHdlIGNhblxuICAgICAgICAgICAgLy8gYWx3YXlzIGludGVyZmFjZSB3aXRoIHRoaXMgbWV0aG9kIGFzeW5jaHJvbm91c2x5LlxuXG4gICAgICAgICAgICAvLyBPcHRpb25hbGx5LCBpZiB0cnVlIGlzIGdpdmVuIGFzIHRoZSBmcm9tU2VydmVyIHBhcmFtZXRlcixcbiAgICAgICAgICAgIC8vIHRoZW4gdGhpcyBjYWNoZWQgdmFsdWUgd2lsbCBub3QgYmUgdXNlZC5cblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNBdXRoZW50aWNhdGVkKCkgJiYgZnJvbVNlcnZlciAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkcS53aGVuKFNlc3Npb24udXNlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE1ha2UgcmVxdWVzdCBHRVQgL3Nlc3Npb24uXG4gICAgICAgICAgICAvLyBJZiBpdCByZXR1cm5zIGEgdXNlciwgY2FsbCBvblN1Y2Nlc3NmdWxMb2dpbiB3aXRoIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgIC8vIElmIGl0IHJldHVybnMgYSA0MDEgcmVzcG9uc2UsIHdlIGNhdGNoIGl0IGFuZCBpbnN0ZWFkIHJlc29sdmUgdG8gbnVsbC5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9zZXNzaW9uJykudGhlbihvblN1Y2Nlc3NmdWxMb2dpbikuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2xvZ2luJywgY3JlZGVudGlhbHMpXG4gICAgICAgICAgICAgICAgLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdCh7IG1lc3NhZ2U6ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLicgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvbG9nb3V0JykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgU2Vzc2lvbi5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxuICAgIGFwcC5zZXJ2aWNlKCdTZXNzaW9uJywgZnVuY3Rpb24gKCRyb290U2NvcGUsIEFVVEhfRVZFTlRTKSB7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuZGVzdHJveSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudXNlciA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoc2Vzc2lvbklkLCB1c2VyKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXIgPSB1c2VyO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSgpKTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvbG9naW4vbG9naW4uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgQXV0aFNlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgJHNjb3BlLmxvZ2luID0ge307XG4gICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5zZW5kTG9naW4gPSBmdW5jdGlvbiAobG9naW5JbmZvKSB7XG5cbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbihsb2dpbkluZm8pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLic7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21lbWJlcnNPbmx5Jywge1xuICAgICAgICB1cmw6ICcvbWVtYmVycy1hcmVhJyxcbiAgICAgICAgdGVtcGxhdGU6ICc8aW1nIG5nLXJlcGVhdD1cIml0ZW0gaW4gc3Rhc2hcIiB3aWR0aD1cIjMwMFwiIG5nLXNyYz1cInt7IGl0ZW0gfX1cIiAvPicsXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsIFNlY3JldFN0YXNoKSB7XG4gICAgICAgICAgICBTZWNyZXRTdGFzaC5nZXRTdGFzaCgpLnRoZW4oZnVuY3Rpb24gKHN0YXNoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnN0YXNoID0gc3Rhc2g7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBkYXRhLmF1dGhlbnRpY2F0ZSBpcyByZWFkIGJ5IGFuIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgIC8vIHRoYXQgY29udHJvbHMgYWNjZXNzIHRvIHRoaXMgc3RhdGUuIFJlZmVyIHRvIGFwcC5qcy5cbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgYXV0aGVudGljYXRlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9KTtcblxufSk7XG5cbmFwcC5mYWN0b3J5KCdTZWNyZXRTdGFzaCcsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gICAgdmFyIGdldFN0YXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL21lbWJlcnMvc2VjcmV0LXN0YXNoJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0U3Rhc2g6IGdldFN0YXNoXG4gICAgfTtcblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncXVlc3Rpb25zJywge1xuICAgICAgICB1cmw6ICcvZGlzY292ZXJ5JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9xdWVzdGlvbnMvcXVlc3Rpb25zLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnUXVlc3Rpb25DdHJsJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1F1ZXN0aW9uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgQXV0aFNlcnZpY2UsIFFTdGFja0ZhY3RvcnkpIHtcbiAgICAkc2NvcGUucXN0YWNrID0gUVN0YWNrRmFjdG9yeS5pbml0aWFsaXplKCk7XG4gICAgJHNjb3BlLmN1cnJlbnQgPSAkc2NvcGUucXN0YWNrLmFkdmFuY2UoKTtcbiAgICAkc2NvcGUuc2VsZWN0ZWQgPSBuZXcgTWFwKCRzY29wZS5xc3RhY2suZGlzcGxheWVkLm1hcChub2RlID0+IFtub2RlLCBmYWxzZV0pKTtcblxuICAgICRzY29wZS5zZWxlY3QgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZC5zZXQobm9kZSwgISRzY29wZS5zZWxlY3RlZC5nZXQobm9kZSkpXG4gICAgICAgIHJldHVybiBub2RlLnNlbGVjdE5vZGUoKTtcbiAgICB9XG4gICAgJHNjb3BlLmFkdmFuY2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKFsuLi4kc2NvcGUuc2VsZWN0ZWQudmFsdWVzKCldLmV2ZXJ5KHZhbHVlID0+IHZhbHVlID09PSBmYWxzZSkpIHJldHVybjtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnQgPSAkc2NvcGUucXN0YWNrLmFkdmFuY2UoKTtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkLmNsZWFyKCk7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZCA9IG5ldyBNYXAoJHNjb3BlLnFzdGFjay5kaXNwbGF5ZWQubWFwKG5vZGUgPT4gW25vZGUsIGZhbHNlXSkpO1xuICAgIH1cbn0pO1xuIiwiYXBwLmZhY3RvcnkoJ0Z1bGxzdGFja1BpY3MnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CN2dCWHVsQ0FBQVhRY0UuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vZmJjZG4tc3Bob3Rvcy1jLWEuYWthbWFpaGQubmV0L2hwaG90b3MtYWsteGFwMS90MzEuMC04LzEwODYyNDUxXzEwMjA1NjIyOTkwMzU5MjQxXzgwMjcxNjg4NDMzMTI4NDExMzdfby5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItTEtVc2hJZ0FFeTlTSy5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3OS1YN29DTUFBa3c3eS5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItVWo5Q09JSUFJRkFoMC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I2eUl5RmlDRUFBcWwxMi5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NFLVQ3NWxXQUFBbXFxSi5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NFdlpBZy1WQUFBazkzMi5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NFZ05NZU9YSUFJZkRoSy5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NFUXlJRE5XZ0FBdTYwQi5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NDRjNUNVFXOEFFMmxHSi5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NBZVZ3NVNXb0FBQUxzai5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NBYUpJUDdVa0FBbElHcy5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NBUU93OWxXRUFBWTlGbC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItT1FiVnJDTUFBTndJTS5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I5Yl9lcndDWUFBd1JjSi5wbmc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I1UFRkdm5DY0FFQWw0eC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I0cXdDMGlDWUFBbFBHaC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0IyYjMzdlJJVUFBOW8xRC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0J3cEl3cjFJVUFBdk8yXy5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0JzU3NlQU5DWUFFT2hMdy5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NKNHZMZnVVd0FBZGE0TC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NJN3d6akVWRUFBT1BwUy5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NJZEh2VDJVc0FBbm5IVi5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NHQ2lQX1lXWUFBbzc1Vi5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NJUzRKUElXSUFJMzdxdS5qcGc6bGFyZ2UnXG4gICAgXTtcbn0pO1xuIiwiYXBwLmZhY3RvcnkoJ1JhbmRvbUdyZWV0aW5ncycsIGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBnZXRSYW5kb21Gcm9tQXJyYXkgPSBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgIHJldHVybiBhcnJbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCldO1xuICAgIH07XG5cbiAgICB2YXIgZ3JlZXRpbmdzID0gW1xuICAgICAgICAnSGVsbG8sIHdvcmxkIScsXG4gICAgICAgICdBdCBsb25nIGxhc3QsIEkgbGl2ZSEnLFxuICAgICAgICAnSGVsbG8sIHNpbXBsZSBodW1hbi4nLFxuICAgICAgICAnV2hhdCBhIGJlYXV0aWZ1bCBkYXkhJyxcbiAgICAgICAgJ0lcXCdtIGxpa2UgYW55IG90aGVyIHByb2plY3QsIGV4Y2VwdCB0aGF0IEkgYW0geW91cnMuIDopJyxcbiAgICAgICAgJ1RoaXMgZW1wdHkgc3RyaW5nIGlzIGZvciBMaW5kc2F5IExldmluZS4nLFxuICAgICAgICAn44GT44KT44Gr44Gh44Gv44CB44Om44O844K244O85qeY44CCJyxcbiAgICAgICAgJ1dlbGNvbWUuIFRvLiBXRUJTSVRFLicsXG4gICAgICAgICc6RCcsXG4gICAgICAgICdZZXMsIEkgdGhpbmsgd2VcXCd2ZSBtZXQgYmVmb3JlLicsXG4gICAgICAgICdHaW1tZSAzIG1pbnMuLi4gSSBqdXN0IGdyYWJiZWQgdGhpcyByZWFsbHkgZG9wZSBmcml0dGF0YScsXG4gICAgICAgICdJZiBDb29wZXIgY291bGQgb2ZmZXIgb25seSBvbmUgcGllY2Ugb2YgYWR2aWNlLCBpdCB3b3VsZCBiZSB0byBuZXZTUVVJUlJFTCEnLFxuICAgIF07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBncmVldGluZ3M6IGdyZWV0aW5ncyxcbiAgICAgICAgZ2V0UmFuZG9tR3JlZXRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRSYW5kb21Gcm9tQXJyYXkoZ3JlZXRpbmdzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgnZnVsbHN0YWNrTG9nbycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL2Z1bGxzdGFjay1sb2dvL2Z1bGxzdGFjay1sb2dvLmh0bWwnXG4gICAgfTtcbn0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgnbmF2YmFyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsIEF1dGhTZXJ2aWNlLCBBVVRIX0VWRU5UUywgJHN0YXRlKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZToge30sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdmJhci5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG5cbiAgICAgICAgICAgIHNjb3BlLml0ZW1zID0gW1xuICAgICAgICAgICAgICAgIHsgbGFiZWw6ICdIb21lJywgc3RhdGU6ICdob21lJyB9LFxuICAgICAgICAgICAgICAgIHsgbGFiZWw6ICdBYm91dCcsIHN0YXRlOiAnYWJvdXQnIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ0RvY3VtZW50YXRpb24nLCBzdGF0ZTogJ2RvY3MnIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ01lbWJlcnMgT25seScsIHN0YXRlOiAnbWVtYmVyc09ubHknLCBhdXRoOiB0cnVlIH1cbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIHNjb3BlLnVzZXIgPSBudWxsO1xuXG4gICAgICAgICAgICBzY29wZS5pc0xvZ2dlZEluID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBzZXRVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgcmVtb3ZlVXNlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzY29wZS51c2VyID0gbnVsbDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHNldFVzZXIoKTtcblxuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzLCBzZXRVc2VyKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MsIHJlbW92ZVVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsIHJlbW92ZVVzZXIpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgncmFuZG9HcmVldGluZycsIGZ1bmN0aW9uIChSYW5kb21HcmVldGluZ3MpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvcmFuZG8tZ3JlZXRpbmcvcmFuZG8tZ3JlZXRpbmcuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgICAgICAgc2NvcGUuZ3JlZXRpbmcgPSBSYW5kb21HcmVldGluZ3MuZ2V0UmFuZG9tR3JlZXRpbmcoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
