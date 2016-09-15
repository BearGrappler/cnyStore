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
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html'
    });
});

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiZG9jcy9kb2NzLmpzIiwiZmFjdG9yaWVzL3FzdGFjay5mYWN0b3J5LmpzIiwiZmFjdG9yaWVzL3F0cmVlLmZhY3RvcnkuanMiLCJmc2EvZnNhLXByZS1idWlsdC5qcyIsImhvbWUvaG9tZS5qcyIsImxvZ2luL2xvZ2luLmpzIiwibWVtYmVycy1vbmx5L21lbWJlcnMtb25seS5qcyIsInF1ZXN0aW9ucy9xdWVzdGlvbi5qcyIsImNvbW1vbi9mYWN0b3JpZXMvRnVsbHN0YWNrUGljcy5qcyIsImNvbW1vbi9mYWN0b3JpZXMvUmFuZG9tR3JlZXRpbmdzLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvZnVsbHN0YWNrLWxvZ28vZnVsbHN0YWNrLWxvZ28uanMiLCJjb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2YmFyLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvcmFuZG8tZ3JlZXRpbmcvcmFuZG8tZ3JlZXRpbmcuanMiXSwibmFtZXMiOlsid2luZG93IiwiYXBwIiwiYW5ndWxhciIsIm1vZHVsZSIsImNvbmZpZyIsIiR1cmxSb3V0ZXJQcm92aWRlciIsIiRsb2NhdGlvblByb3ZpZGVyIiwiaHRtbDVNb2RlIiwib3RoZXJ3aXNlIiwid2hlbiIsImxvY2F0aW9uIiwicmVsb2FkIiwicnVuIiwiJHJvb3RTY29wZSIsIkF1dGhTZXJ2aWNlIiwiJHN0YXRlIiwiZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCIsInN0YXRlIiwiZGF0YSIsImF1dGhlbnRpY2F0ZSIsIiRvbiIsImV2ZW50IiwidG9TdGF0ZSIsInRvUGFyYW1zIiwiaXNBdXRoZW50aWNhdGVkIiwicHJldmVudERlZmF1bHQiLCJnZXRMb2dnZWRJblVzZXIiLCJ0aGVuIiwidXNlciIsImdvIiwibmFtZSIsIiRzdGF0ZVByb3ZpZGVyIiwidXJsIiwiY29udHJvbGxlciIsInRlbXBsYXRlVXJsIiwiJHNjb3BlIiwiRnVsbHN0YWNrUGljcyIsImltYWdlcyIsIl8iLCJzaHVmZmxlIiwiZmFjdG9yeSIsIiRodHRwIiwiUVRyZWVGYWN0b3J5IiwiZGVmYXVsdEZpbHRlcnMiLCJjb21wdXRlciIsInR5cGUiLCJwcmljZSIsInByaW9yaXR5IiwicHJvY2Vzc29yIiwicmFtIiwiaGRkIiwiY3B1IiwiZ3B1IiwiUXVlc3Rpb25uYWlyZSIsImJpbmQiLCJxdWVzdGlvbnMiLCJob21lIiwiZGVza3RvcCIsImxhcHRvcCIsImdhbWVyIiwiYXJ0aXN0Iiwic3R1ZGVudCIsImNhc3VhbCIsImdhbWVyR2VucmVSVFMiLCJnYW1lckdlbnJlUlBHIiwiZ2FtZXJHZW5yZUZQUyIsImdhbWVyR2VucmVJTkRJRSIsImFydGlzdEdlbnJlQXVkaW8iLCJhcnRpc3RHZW5yZVZpZGVvIiwiYXJ0aXN0R2VucmVQaG90byIsInN0dWRlbnRNYWpvclNURU0iLCJzdHVkZW50TWFqb3JUcmFkZSIsInN0dWRlbnRNYWpvckxpYkFydHMiLCJzdHVkZW50TWFqb3JTcG9ydHMiLCJzcGVlZCIsImdyYXBoaWNzIiwic3BhY2UiLCJyb3VuZGVkIiwiUXVlc3Rpb25TdGFjayIsInJvb3ROb2RlIiwiZmlsdGVycyIsInN0YWNrIiwiZGlzcGxheWVkIiwic2VsZWN0ZWQiLCJjdXJyZW50RmlsdGVycyIsIk9iamVjdCIsImFzc2lnbiIsInByb3RvdHlwZSIsImFkZCIsIm5vZGVzIiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsInB1c2giLCJub2RlIiwib2JqIiwia2V5cyIsImhhc093blByb3BlcnR5Iiwia2V5IiwiYWR2YW5jZSIsImZpbHRlciIsImFuc3dlcnMiLCJsZW5ndGgiLCJuZXh0Tm9kZSIsInBvcCIsInNldFN0YWNrIiwiZmluZE5vZGVCeUlkIiwiaWQiLCJhbnN3ZXIiLCJpbml0aWFsaXplIiwiYWRkQW5zd2VyIiwiY2hhaW5BbnN3ZXIiLCJsYWJlbCIsInF1ZXN0aW9uIiwiZmlsdGVyc09iaiIsInBhcmVudCIsInNlbGVjdE5vZGUiLCJjb25zb2xlIiwibG9nIiwiRXJyb3IiLCJpbyIsIm9yaWdpbiIsImNvbnN0YW50IiwibG9naW5TdWNjZXNzIiwibG9naW5GYWlsZWQiLCJsb2dvdXRTdWNjZXNzIiwic2Vzc2lvblRpbWVvdXQiLCJub3RBdXRoZW50aWNhdGVkIiwibm90QXV0aG9yaXplZCIsIiRxIiwiQVVUSF9FVkVOVFMiLCJzdGF0dXNEaWN0IiwicmVzcG9uc2VFcnJvciIsInJlc3BvbnNlIiwiJGJyb2FkY2FzdCIsInN0YXR1cyIsInJlamVjdCIsIiRodHRwUHJvdmlkZXIiLCJpbnRlcmNlcHRvcnMiLCIkaW5qZWN0b3IiLCJnZXQiLCJzZXJ2aWNlIiwiU2Vzc2lvbiIsIm9uU3VjY2Vzc2Z1bExvZ2luIiwiY3JlYXRlIiwiZnJvbVNlcnZlciIsImNhdGNoIiwibG9naW4iLCJjcmVkZW50aWFscyIsInBvc3QiLCJtZXNzYWdlIiwibG9nb3V0IiwiZGVzdHJveSIsInNlbGYiLCJzZXNzaW9uSWQiLCJlcnJvciIsInNlbmRMb2dpbiIsImxvZ2luSW5mbyIsInRlbXBsYXRlIiwiU2VjcmV0U3Rhc2giLCJnZXRTdGFzaCIsInN0YXNoIiwiUVN0YWNrRmFjdG9yeSIsInFzdGFjayIsImN1cnJlbnQiLCJNYXAiLCJtYXAiLCJzZWxlY3QiLCJzZXQiLCJ2YWx1ZXMiLCJldmVyeSIsInZhbHVlIiwiY2xlYXIiLCJnZXRSYW5kb21Gcm9tQXJyYXkiLCJhcnIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJncmVldGluZ3MiLCJnZXRSYW5kb21HcmVldGluZyIsImRpcmVjdGl2ZSIsInJlc3RyaWN0Iiwic2NvcGUiLCJsaW5rIiwiaXRlbXMiLCJhdXRoIiwiaXNMb2dnZWRJbiIsInNldFVzZXIiLCJyZW1vdmVVc2VyIiwiUmFuZG9tR3JlZXRpbmdzIiwiZ3JlZXRpbmciXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBQ0FBLE9BQUFDLEdBQUEsR0FBQUMsUUFBQUMsTUFBQSxDQUFBLHVCQUFBLEVBQUEsQ0FBQSxhQUFBLEVBQUEsV0FBQSxFQUFBLGNBQUEsRUFBQSxXQUFBLENBQUEsQ0FBQTs7QUFFQUYs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LElBQUEsQ0FBQSxZQUFBO0FBQ0FaLDJCQUFBYyxFQUFBLENBQUEsTUFBQTtBQUNBLGlCQUZBO0FBR0EsYUFKQTs7QUFNQSxnQkFBQThKLFVBQUEsU0FBQUEsT0FBQSxHQUFBO0FBQ0E3Syw0QkFBQVksZUFBQSxHQUFBQyxJQUFBLENBQUEsVUFBQUMsSUFBQSxFQUFBO0FBQ0EwSiwwQkFBQTFKLElBQUEsR0FBQUEsSUFBQTtBQUNBLGlCQUZBO0FBR0EsYUFKQTs7QUFNQSxnQkFBQWdLLGFBQUEsU0FBQUEsVUFBQSxHQUFBO0FBQ0FOLHNCQUFBMUosSUFBQSxHQUFBLElBQUE7QUFDQSxhQUZBOztBQUlBK0o7O0FBRUE5Syx1QkFBQU8sR0FBQSxDQUFBOEcsWUFBQVAsWUFBQSxFQUFBZ0UsT0FBQTtBQUNBOUssdUJBQUFPLEdBQUEsQ0FBQThHLFlBQUFMLGFBQUEsRUFBQStELFVBQUE7QUFDQS9LLHVCQUFBTyxHQUFBLENBQUE4RyxZQUFBSixjQUFBLEVBQUE4RCxVQUFBO0FBRUE7O0FBekNBLEtBQUE7QUE2Q0EsQ0EvQ0E7O0FDQUEzTCxJQUFBbUwsU0FBQSxDQUFBLGVBQUEsRUFBQSxVQUFBUyxlQUFBLEVBQUE7O0FBRUEsV0FBQTtBQUNBUixrQkFBQSxHQURBO0FBRUFuSixxQkFBQSx5REFGQTtBQUdBcUosY0FBQSxjQUFBRCxLQUFBLEVBQUE7QUFDQUEsa0JBQUFRLFFBQUEsR0FBQUQsZ0JBQUFWLGlCQUFBLEVBQUE7QUFDQTtBQUxBLEtBQUE7QUFRQSxDQVZBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG53aW5kb3cuYXBwID0gYW5ndWxhci5tb2R1bGUoJ0Z1bGxzdGFja0dlbmVyYXRlZEFwcCcsIFsnZnNhUHJlQnVpbHQnLCAndWkucm91dGVyJywgJ3VpLmJvb3RzdHJhcCcsICduZ0FuaW1hdGUnXSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAvLyBUaGlzIHR1cm5zIG9mZiBoYXNoYmFuZyB1cmxzICgvI2Fib3V0KSBhbmQgY2hhbmdlcyBpdCB0byBzb21ldGhpbmcgbm9ybWFsICgvYWJvdXQpXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgIC8vIElmIHdlIGdvIHRvIGEgVVJMIHRoYXQgdWktcm91dGVyIGRvZXNuJ3QgaGF2ZSByZWdpc3RlcmVkLCBnbyB0byB0aGUgXCIvXCIgdXJsLlxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcbiAgICAvLyBUcmlnZ2VyIHBhZ2UgcmVmcmVzaCB3aGVuIGFjY2Vzc2luZyBhbiBPQXV0aCByb3V0ZVxuICAgICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKCcvYXV0aC86cHJvdmlkZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KTtcbn0pO1xuXG4vLyBUaGlzIGFwcC5ydW4gaXMgZm9yIGNvbnRyb2xsaW5nIGFjY2VzcyB0byBzcGVjaWZpYyBzdGF0ZXMuXG5hcHAucnVuKGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBBdXRoU2VydmljZSwgJHN0YXRlKSB7XG5cbiAgICAvLyBUaGUgZ2l2ZW4gc3RhdGUgcmVxdWlyZXMgYW4gYXV0aGVudGljYXRlZCB1c2VyLlxuICAgIHZhciBkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZS5kYXRhICYmIHN0YXRlLmRhdGEuYXV0aGVudGljYXRlO1xuICAgIH07XG5cbiAgICAvLyAkc3RhdGVDaGFuZ2VTdGFydCBpcyBhbiBldmVudCBmaXJlZFxuICAgIC8vIHdoZW5ldmVyIHRoZSBwcm9jZXNzIG9mIGNoYW5naW5nIGEgc3RhdGUgYmVnaW5zLlxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMpIHtcblxuICAgICAgICBpZiAoIWRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGgodG9TdGF0ZSkpIHtcbiAgICAgICAgICAgIC8vIFRoZSBkZXN0aW5hdGlvbiBzdGF0ZSBkb2VzIG5vdCByZXF1aXJlIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgICAgICAgICAvLyBUaGUgdXNlciBpcyBhdXRoZW50aWNhdGVkLlxuICAgICAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCB3aXRoIHJldHVybi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENhbmNlbCBuYXZpZ2F0aW5nIHRvIG5ldyBzdGF0ZS5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBBdXRoU2VydmljZS5nZXRMb2dnZWRJblVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICAvLyBJZiBhIHVzZXIgaXMgcmV0cmlldmVkLCB0aGVuIHJlbmF2aWdhdGUgdG8gdGhlIGRlc3RpbmF0aW9uXG4gICAgICAgICAgICAvLyAodGhlIHNlY29uZCB0aW1lLCBBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSB3aWxsIHdvcmspXG4gICAgICAgICAgICAvLyBvdGhlcndpc2UsIGlmIG5vIHVzZXIgaXMgbG9nZ2VkIGluLCBnbyB0byBcImxvZ2luXCIgc3RhdGUuXG4gICAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyh0b1N0YXRlLm5hbWUsIHRvUGFyYW1zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKmFib3V0KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWJvdXQnLCB7XG4gICAgICAgIHVybDogJy9hYm91dCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBYm91dENvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2Fib3V0L2Fib3V0Lmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWJvdXRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgRnVsbHN0YWNrUGljcykge1xuXG4gICAgLy8gSW1hZ2VzIG9mIGJlYXV0aWZ1bCBGdWxsc3RhY2sgcGVvcGxlLlxuICAgICRzY29wZS5pbWFnZXMgPSBfLnNodWZmbGUoRnVsbHN0YWNrUGljcyk7XG5cbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnZG9jcycsIHtcbiAgICAgICAgdXJsOiAnL2RvY3MnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2RvY3MvZG9jcy5odG1sJ1xuICAgIH0pO1xufSk7XG4iLCJhcHAuZmFjdG9yeSgnUVN0YWNrRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwLCBRVHJlZUZhY3RvcnkpIHtcblxuICAgIGxldCBkZWZhdWx0RmlsdGVycyA9IHtcbiAgICAgICAgY29tcHV0ZXI6IFtdLFxuICAgICAgICB0eXBlOiBbXSxcbiAgICAgICAgcHJpY2U6IFtdLFxuICAgICAgICBwcmlvcml0eTogW10sXG4gICAgICAgIHByb2Nlc3NvcjogW10sXG4gICAgICAgIHJhbTogW10sXG4gICAgICAgIGhkZDogW10sXG4gICAgICAgIGNwdTogW10sXG4gICAgICAgIGdwdTogW11cbiAgICB9O1xuXG4gICAgbGV0IFF1ZXN0aW9ubmFpcmUgPSBRVHJlZUZhY3RvcnkuYmluZChRVHJlZUZhY3RvcnkpO1xuXG4gICAgLy8gUHJvYmFibHkgc2hvdWxkIG1vdmUgdG8gYSBkYXRhYmFzZSBhdCBzb21lIHBvaW50IGluIHRoZSBmdXR1cmUgdGltZWxpbmUuLi5cbiAgICBsZXQgcXVlc3Rpb25zID0ge1xuICAgICAgICBob21lOiBuZXcgUXVlc3Rpb25uYWlyZSgwLCAnSG9tZScsICdXaGljaCB0eXBlIG9mIGNvbXB1dGVyIGFyZSB5b3UgbG9va2luZyBmb3I/Jywge30pLFxuICAgICAgICBkZXNrdG9wOiBuZXcgUXVlc3Rpb25uYWlyZSgxLCAnRGVza3RvcCcsICdXaGljaCB0eXBlIG9mIHVzZXIgYXJlIHlvdT8nLCB7IGNvbXB1dGVyOiAnZGVza3RvcCcgfSksXG4gICAgICAgIGxhcHRvcDogbmV3IFF1ZXN0aW9ubmFpcmUoMiwgJ0xhcHRvcCcsICdXaGljaCB0eXBlIG9mIHVzZXIgYXJlIHlvdT8nLCB7IGNvbXB1dGVyOiAnbGFwdG9wJyB9KSxcbiAgICAgICAgZ2FtZXI6IG5ldyBRdWVzdGlvbm5haXJlKDMsICdHYW1lcicsICdTZWxlY3QgeW91ciBmYXZvcml0ZSBnZW5yZXMnLCB7IHR5cGU6ICdnYW1lcicgfSksXG4gICAgICAgIGFydGlzdDogbmV3IFF1ZXN0aW9ubmFpcmUoNCwgJ0FydGlzdCcsICdEbyB5b3Ugd29yayB3aXRoIGF1ZGlvPyBWaWRlbz8gTW9yZSBjcmVhdGl2ZSBtZWRpYT8nLCB7IHR5cGU6ICdhcnRpc3QnIH0pLFxuICAgICAgICBzdHVkZW50OiBuZXcgUXVlc3Rpb25uYWlyZSg1LCAnU3R1ZGVudCcsICdXaGF0IGFyZSB5b3Ugc3R1ZHlpbmc/JywgeyB0eXBlOiAnc3R1ZGVudCcgfSksXG4gICAgICAgIGNhc3VhbDogbmV3IFF1ZXN0aW9ubmFpcmUoNiwgJ0Nhc3VhbCcsIFwiV2hhdCdzIGltcG9ydGFudCB0byB5b3U/XCIsIHsgdHlwZTogJ2Nhc3VhbCcgfSksXG5cbiAgICAgICAgZ2FtZXJHZW5yZVJUUzogbmV3IFF1ZXN0aW9ubmFpcmUoNywgJ1N0cmF0ZWd5JywgXCJXaGF0J3MgaW1wb3J0YW50IHRvIHlvdT9cIiwgeyBjcHU6ICc0JywgcmFtOiAnNCcsIGdwdTogJzInIH0pLFxuICAgICAgICBnYW1lckdlbnJlUlBHOiBuZXcgUXVlc3Rpb25uYWlyZSg4LCAnUm9sZSBQbGF5aW5nIEdhbWVzJywgXCJXaGF0J3MgaW1wb3J0YW50IHRvIHlvdT9cIiwgeyBjcHU6ICc0JywgcmFtOiAnMycsIGdwdTogJzQnIH0pLFxuICAgICAgICBnYW1lckdlbnJlRlBTOiBuZXcgUXVlc3Rpb25uYWlyZSg5LCAnRlBTL0FjdGlvbicsIFwiV2hhdCdzIGltcG9ydGFudCB0byB5b3U/XCIsIHsgY3B1OiAnNCcsIHJhbTogJzMnLCBncHU6ICc0JyB9KSxcbiAgICAgICAgZ2FtZXJHZW5yZUlORElFOiBuZXcgUXVlc3Rpb25uYWlyZSgxMCwgJ0luZGllJywgXCJXaGF0J3MgaW1wb3J0YW50IHRvIHlvdT9cIiwgeyBjcHU6ICcyJywgcmFtOiAnMicsIGdwdTogJzInIH0pLFxuXG4gICAgICAgIGFydGlzdEdlbnJlQXVkaW86IG5ldyBRdWVzdGlvbm5haXJlKDExLCAnQXVkaW8nLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IGNwdTogJzQnLCByYW06ICczJywgZ3B1OiAnMCcgfSksXG4gICAgICAgIGFydGlzdEdlbnJlVmlkZW86IG5ldyBRdWVzdGlvbm5haXJlKDEyLCAnVmlkZW8nLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IGNwdTogJzQnLCByYW06ICczJywgZ3B1OiAnMScgfSksXG4gICAgICAgIGFydGlzdEdlbnJlUGhvdG86IG5ldyBRdWVzdGlvbm5haXJlKDEzLCAnUGhvdG8nLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IGNwdTogJzMnLCByYW06ICcyJywgZ3B1OiAnMCcgfSksXG5cbiAgICAgICAgc3R1ZGVudE1ham9yU1RFTTogbmV3IFF1ZXN0aW9ubmFpcmUoMTQsICdTY2llbmNlL1RlY2hub2xvZ3kvTWF0aCcsIFwiV2hhdCdzIGltcG9ydGFudCB0byB5b3U/XCIsIHsgY3B1OiAnMycsIHJhbTogJzInLCBncHU6ICcxJyB9KSxcbiAgICAgICAgc3R1ZGVudE1ham9yVHJhZGU6IG5ldyBRdWVzdGlvbm5haXJlKDE1LCAnVHJhZGUgU2Nob29sJywgXCJXaGF0J3MgaW1wb3J0YW50IHRvIHlvdT9cIiwgeyBjcHU6ICcxJywgcmFtOiAnMScsIGdwdTogJzAnIH0pLFxuICAgICAgICBzdHVkZW50TWFqb3JMaWJBcnRzOiBuZXcgUXVlc3Rpb25uYWlyZSgxNiwgJ0xpYmVyYWwgQXJ0cycsIFwiV2hhdCdzIGltcG9ydGFudCB0byB5b3U/XCIsIHsgY3B1OiAnMicsIHJhbTogJzInLCBncHU6ICcwJyB9KSxcbiAgICAgICAgc3R1ZGVudE1ham9yU3BvcnRzOiBuZXcgUXVlc3Rpb25uYWlyZSgxNywgJ1Nwb3J0cycsIFwiV2hhdCdzIGltcG9ydGFudCB0byB5b3U/XCIsIHsgY3B1OiAnMScsIHJhbTogJzInLCBncHU6ICcwJyB9KSxcblxuICAgICAgICBwcmljZTogbmV3IFF1ZXN0aW9ubmFpcmUoMTgsICdQcmljZScsICcnLCB7IHByaWNlOiAnMScgfSksXG4gICAgICAgIHNwZWVkOiBuZXcgUXVlc3Rpb25uYWlyZSgxOSwgJ1NwZWVkJywgJycsIHsgY3B1OiAnMycsIHJhbTogJzInLCBncHU6ICcwJywgaGRkOiAnNCcsIHByaWNlOiAnNScgfSksXG4gICAgICAgIGdyYXBoaWNzOiBuZXcgUXVlc3Rpb25uYWlyZSgyMCwgJ0dyYXBoaWNzJywgJycsIHsgZ3B1OiAnNScsIHByaWNlOiAnNCcgfSksXG4gICAgICAgIHNwYWNlOiBuZXcgUXVlc3Rpb25uYWlyZSgyMSwgJ1NwYWNlJywgJycsIHsgaGRkOiAnNScsIHByaWNlOiAnMycgfSksXG4gICAgICAgIHJvdW5kZWQ6IG5ldyBRdWVzdGlvbm5haXJlKDIyLCAnV2VsbC1Sb3VuZGVkJywgJycsIHsgY3B1OiAnMicsIHJhbTogJzInLCBncHU6ICcyJywgaGRkOiAnMicsIHByaWNlOiAnMicgfSksXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFF1ZXN0aW9uU3RhY2sgU3RhY2sgQ29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1tRdWVzdGlvbm5haXJlXX0gcm9vdE5vZGUgW1RoZSByb290IG5vZGUgb2YgdGhlIHF1ZXN0aW9uIHRyZWUgKHNob3VsZCBiZSAnaG9tZScgbm9kZSAtIElEOiAxKV1cbiAgICAgKiBAcGFyYW0ge1tPYmplY3RdfSAgICAgICAgZmlsdGVycyAgW0ZpbHRlcnMgdG8gbG9hZCAtIGNhbiByZXRyaWV2ZSBmaWx0ZXJzIGZyb20gQ2FydCBlbnRyeSBpbiBEQl1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBRdWVzdGlvblN0YWNrKHJvb3ROb2RlLCBmaWx0ZXJzKSB7XG4gICAgICAgIHRoaXMuc3RhY2sgPSBbXTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWQgPSBbXTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnRGaWx0ZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdEZpbHRlcnMsIGZpbHRlcnMpO1xuICAgICAgICB0aGlzLnJvb3ROb2RlID0gcm9vdE5vZGU7XG4gICAgfVxuXG4gICAgUXVlc3Rpb25TdGFjay5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24obm9kZXMpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobm9kZXMpKSB7XG4gICAgICAgICAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4gdGhpcy5zdGFjay5wdXNoKG5vZGUpKTtcbiAgICAgICAgfSBlbHNlIHsgdGhpcy5zdGFjay5wdXNoKG5vZGVzKTsgfVxuICAgIH1cblxuICAgIFF1ZXN0aW9uU3RhY2sucHJvdG90eXBlLmFzc2lnbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgICAgIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEZpbHRlcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEZpbHRlcnNba2V5XS5wdXNoKG9ialtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBRdWVzdGlvblN0YWNrLnByb3RvdHlwZS5hZHZhbmNlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLmRpc3BsYXllZC5maWx0ZXIobm9kZSA9PiBub2RlLnNlbGVjdGVkKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZC5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgbm9kZS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKG5vZGUuYW5zd2Vycy5sZW5ndGgpIHRoaXMuYWRkKG5vZGUpO1xuICAgICAgICAgICAgdGhpcy5hc3NpZ24obm9kZS5maWx0ZXJzKTtcbiAgICAgICAgfSlcbiAgICAgICAgbGV0IG5leHROb2RlID0gdGhpcy5zdGFjay5sZW5ndGggPiAwID8gdGhpcy5zdGFjay5wb3AoKSA6IG51bGw7XG4gICAgICAgIHRoaXMuZGlzcGxheWVkID0gbmV4dE5vZGUgPyBuZXh0Tm9kZS5hbnN3ZXJzIDogW107XG4gICAgICAgIHJldHVybiBuZXh0Tm9kZTtcbiAgICB9XG5cbiAgICBRdWVzdGlvblN0YWNrLnByb3RvdHlwZS5zZXRTdGFjayA9IGZ1bmN0aW9uKG9iaiwgZmlsdGVycyA9IHt9KSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHRoaXMuc3RhY2sgPSBvYmo7XG4gICAgICAgIGVsc2UgdGhpcy5zdGFjayA9IFtvYmpdO1xuICAgICAgICB0aGlzLmRpc3BsYXllZCA9IG9iai5hbnN3ZXJzO1xuICAgICAgICB0aGlzLmFzc2lnbihmaWx0ZXJzKTtcbiAgICB9XG5cbiAgICBRdWVzdGlvblN0YWNrLnByb3RvdHlwZS5maW5kTm9kZUJ5SWQgPSBmdW5jdGlvbihub2RlLCBpZCkge1xuICAgICAgICBpZiAoIW5vZGUpIG5vZGUgPSB0aGlzLnJvb3ROb2RlO1xuICAgICAgICBpZiAobm9kZS5pZCA9PT0gaWQpIHRoaXMuc2V0U3RhY2sobm9kZSk7XG4gICAgICAgIGVsc2Ugbm9kZS5hbnN3ZXJzLmZvckVhY2goYW5zd2VyID0+IFF1ZXN0aW9ubmFpcmUuZmluZE5vZGVCeUlkKGFuc3dlciwgaWQpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyB0cmVlIHN0cnVjdHVyZS9hc3NvY2lhdGlvbnMgZm9yIHF1ZXN0aW9ubmFpcmUuXG4gICAgICogQHJldHVybiB7W3VuZGVmaW5lZF19IFtOb3RoaW5nIHJldHVybmVkXVxuICAgICAqL1xuICAgIFF1ZXN0aW9uU3RhY2sucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcXVlc3Rpb25zLmhvbWUuYWRkQW5zd2VyKHF1ZXN0aW9ucy5kZXNrdG9wKTtcbiAgICAgICAgcXVlc3Rpb25zLmhvbWUuYWRkQW5zd2VyKHF1ZXN0aW9ucy5sYXB0b3ApO1xuXG4gICAgICAgIHF1ZXN0aW9ucy5kZXNrdG9wXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5nYW1lcilcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmFydGlzdClcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLnN0dWRlbnQpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5jYXN1YWwpO1xuXG4gICAgICAgIHF1ZXN0aW9ucy5sYXB0b3BcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmdhbWVyKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuYXJ0aXN0KVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuc3R1ZGVudClcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmNhc3VhbCk7XG5cbiAgICAgICAgcXVlc3Rpb25zLmdhbWVyXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5nYW1lckdlbnJlUlRTKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuZ2FtZXJHZW5yZUlORElFKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuZ2FtZXJHZW5yZUZQUylcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmdhbWVyR2VucmVSUEcpO1xuXG4gICAgICAgIHF1ZXN0aW9ucy5nYW1lclxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5wcmljZSlcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMuc3BlZWQpXG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLmdyYXBoaWNzKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5zcGFjZSlcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMucm91bmRlZCk7XG5cbiAgICAgICAgcXVlc3Rpb25zLmFydGlzdFxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuYXJ0aXN0R2VucmVQaG90bylcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmFydGlzdEdlbnJlQXVkaW8pXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5hcnRpc3RHZW5yZVZpZGVvKTtcblxuICAgICAgICBxdWVzdGlvbnMuYXJ0aXN0XG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLnByaWNlKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5zcGVlZClcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMuZ3JhcGhpY3MpXG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLnNwYWNlKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5yb3VuZGVkKTtcblxuICAgICAgICBxdWVzdGlvbnMuc3R1ZGVudFxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuc3R1ZGVudE1ham9yU1RFTSlcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLnN0dWRlbnRNYWpvclRyYWRlKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuc3R1ZGVudE1ham9yU3BvcnRzKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuc3R1ZGVudE1ham9yTGliQXJ0cyk7XG4gICAgICAgIHF1ZXN0aW9ucy5zdHVkZW50XG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLnByaWNlKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5zcGVlZClcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMuZ3JhcGhpY3MpXG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLnNwYWNlKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5yb3VuZGVkKTtcblxuICAgICAgICBxdWVzdGlvbnMuY2FzdWFsXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5wcmljZSlcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLnNwZWVkKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuZ3JhcGhpY3MpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5zcGFjZSlcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLnJvdW5kZWQpO1xuXG5cbiAgICAgICAgdGhpcy5zZXRTdGFjayh0aGlzLnJvb3ROb2RlKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFF1ZXN0aW9uU3RhY2socXVlc3Rpb25zLmhvbWUpO1xuXG59KTtcbiIsImFwcC5mYWN0b3J5KCdRVHJlZUZhY3RvcnknLCBmdW5jdGlvbigpIHtcblxuXHQvKipcbiAgICAgKiBRdWVzdGlvbm5haXJlIFRyZWUgQ29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1tOdW1iZXJdfSBpZCAgICAgICAgIFtJbnRlZ2VyIGtleSBmb3IgdGhlIG5vZGUgKGVuYWJsZXMgbG9va3VwKV1cbiAgICAgKiBAcGFyYW0ge1tTdHJpbmddfSBsYWJlbCAgICAgIFtEZXNjcmlwdG9yIHRvIGRpc3BsYXkgb24gc2VsZWN0b3IgZWxlbWVudF1cbiAgICAgKiBAcGFyYW0ge1tTdHJpbmddfSBxdWVzdGlvbiAgIFtRdWVzdGlvbiB0byBkaXNwbGF5IHRvIHVzZXIgKGFuc3dlciBzZWxlY3RvcnMgYXJlIGluIHRoaXMuYW5zd2VycyldXG4gICAgICogQHBhcmFtIHtbT2JqZWN0XX0gZmlsdGVyc09iaiBbRmlsdGVycyB0byBhcHBseSBiYXNlZCBvbiBhbnN3ZXIgY2hvaWNlXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFF1ZXN0aW9ubmFpcmUoaWQsIGxhYmVsLCBxdWVzdGlvbiwgZmlsdGVyc09iaikge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBxdWVzdGlvbjtcbiAgICAgICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgICAgICB0aGlzLmZpbHRlcnMgPSBmaWx0ZXJzT2JqXG4gICAgICAgIHRoaXMuYW5zd2VycyA9IFtdO1xuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBRdWVzdGlvbm5haXJlLnByb3RvdHlwZS5hZGRBbnN3ZXIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIG5vZGUucGFyZW50ID0gdGhpcztcbiAgICAgICAgdGhpcy5hbnN3ZXJzLnB1c2gobm9kZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgUXVlc3Rpb25uYWlyZS5wcm90b3R5cGUuY2hhaW5BbnN3ZXIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHRoaXMuYW5zd2Vycy5mb3JFYWNoKGFuc3dlciA9PiB7XG4gICAgICAgICAgICBhbnN3ZXIuYWRkQW5zd2VyKG5vZGUpXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBRdWVzdGlvbm5haXJlLnByb3RvdHlwZS5zZWxlY3ROb2RlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSAhdGhpcy5zZWxlY3RlZDtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5sYWJlbCwgdGhpcy5zZWxlY3RlZCA/ICdvbicgOiAnb2ZmJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFF1ZXN0aW9ubmFpcmU7XG5cbn0pO1xuIiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIEhvcGUgeW91IGRpZG4ndCBmb3JnZXQgQW5ndWxhciEgRHVoLWRveS5cbiAgICBpZiAoIXdpbmRvdy5hbmd1bGFyKSB0aHJvdyBuZXcgRXJyb3IoJ0kgY2FuXFwndCBmaW5kIEFuZ3VsYXIhJyk7XG5cbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2ZzYVByZUJ1aWx0JywgW10pO1xuXG4gICAgYXBwLmZhY3RvcnkoJ1NvY2tldCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF3aW5kb3cuaW8pIHRocm93IG5ldyBFcnJvcignc29ja2V0LmlvIG5vdCBmb3VuZCEnKTtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbyh3aW5kb3cubG9jYXRpb24ub3JpZ2luKTtcbiAgICB9KTtcblxuICAgIC8vIEFVVEhfRVZFTlRTIGlzIHVzZWQgdGhyb3VnaG91dCBvdXIgYXBwIHRvXG4gICAgLy8gYnJvYWRjYXN0IGFuZCBsaXN0ZW4gZnJvbSBhbmQgdG8gdGhlICRyb290U2NvcGVcbiAgICAvLyBmb3IgaW1wb3J0YW50IGV2ZW50cyBhYm91dCBhdXRoZW50aWNhdGlvbiBmbG93LlxuICAgIGFwcC5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCB7XG4gICAgICAgIGxvZ2luU3VjY2VzczogJ2F1dGgtbG9naW4tc3VjY2VzcycsXG4gICAgICAgIGxvZ2luRmFpbGVkOiAnYXV0aC1sb2dpbi1mYWlsZWQnLFxuICAgICAgICBsb2dvdXRTdWNjZXNzOiAnYXV0aC1sb2dvdXQtc3VjY2VzcycsXG4gICAgICAgIHNlc3Npb25UaW1lb3V0OiAnYXV0aC1zZXNzaW9uLXRpbWVvdXQnLFxuICAgICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICAgIG5vdEF1dGhvcml6ZWQ6ICdhdXRoLW5vdC1hdXRob3JpemVkJ1xuICAgIH0pO1xuXG4gICAgYXBwLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkcSwgQVVUSF9FVkVOVFMpIHtcbiAgICAgICAgdmFyIHN0YXR1c0RpY3QgPSB7XG4gICAgICAgICAgICA0MDE6IEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsXG4gICAgICAgICAgICA0MDM6IEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWQsXG4gICAgICAgICAgICA0MTk6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LFxuICAgICAgICAgICAgNDQwOiBBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KHN0YXR1c0RpY3RbcmVzcG9uc2Uuc3RhdHVzXSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzcG9uc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBhcHAuY29uZmlnKGZ1bmN0aW9uICgkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goW1xuICAgICAgICAgICAgJyRpbmplY3RvcicsXG4gICAgICAgICAgICBmdW5jdGlvbiAoJGluamVjdG9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRpbmplY3Rvci5nZXQoJ0F1dGhJbnRlcmNlcHRvcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGFwcC5zZXJ2aWNlKCdBdXRoU2VydmljZScsIGZ1bmN0aW9uICgkaHR0cCwgU2Vzc2lvbiwgJHJvb3RTY29wZSwgQVVUSF9FVkVOVFMsICRxKSB7XG5cbiAgICAgICAgZnVuY3Rpb24gb25TdWNjZXNzZnVsTG9naW4ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHZhciB1c2VyID0gcmVzcG9uc2UuZGF0YS51c2VyO1xuICAgICAgICAgICAgU2Vzc2lvbi5jcmVhdGUodXNlcik7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzKTtcbiAgICAgICAgICAgIHJldHVybiB1c2VyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXNlcyB0aGUgc2Vzc2lvbiBmYWN0b3J5IHRvIHNlZSBpZiBhblxuICAgICAgICAvLyBhdXRoZW50aWNhdGVkIHVzZXIgaXMgY3VycmVudGx5IHJlZ2lzdGVyZWQuXG4gICAgICAgIHRoaXMuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICEhU2Vzc2lvbi51c2VyO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2V0TG9nZ2VkSW5Vc2VyID0gZnVuY3Rpb24gKGZyb21TZXJ2ZXIpIHtcblxuICAgICAgICAgICAgLy8gSWYgYW4gYXV0aGVudGljYXRlZCBzZXNzaW9uIGV4aXN0cywgd2VcbiAgICAgICAgICAgIC8vIHJldHVybiB0aGUgdXNlciBhdHRhY2hlZCB0byB0aGF0IHNlc3Npb25cbiAgICAgICAgICAgIC8vIHdpdGggYSBwcm9taXNlLiBUaGlzIGVuc3VyZXMgdGhhdCB3ZSBjYW5cbiAgICAgICAgICAgIC8vIGFsd2F5cyBpbnRlcmZhY2Ugd2l0aCB0aGlzIG1ldGhvZCBhc3luY2hyb25vdXNseS5cblxuICAgICAgICAgICAgLy8gT3B0aW9uYWxseSwgaWYgdHJ1ZSBpcyBnaXZlbiBhcyB0aGUgZnJvbVNlcnZlciBwYXJhbWV0ZXIsXG4gICAgICAgICAgICAvLyB0aGVuIHRoaXMgY2FjaGVkIHZhbHVlIHdpbGwgbm90IGJlIHVzZWQuXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQXV0aGVudGljYXRlZCgpICYmIGZyb21TZXJ2ZXIgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbihTZXNzaW9uLnVzZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBNYWtlIHJlcXVlc3QgR0VUIC9zZXNzaW9uLlxuICAgICAgICAgICAgLy8gSWYgaXQgcmV0dXJucyBhIHVzZXIsIGNhbGwgb25TdWNjZXNzZnVsTG9naW4gd2l0aCB0aGUgcmVzcG9uc2UuXG4gICAgICAgICAgICAvLyBJZiBpdCByZXR1cm5zIGEgNDAxIHJlc3BvbnNlLCB3ZSBjYXRjaCBpdCBhbmQgaW5zdGVhZCByZXNvbHZlIHRvIG51bGwuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvc2Vzc2lvbicpLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9sb2dpbicsIGNyZWRlbnRpYWxzKVxuICAgICAgICAgICAgICAgIC50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKVxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoeyBtZXNzYWdlOiAnSW52YWxpZCBsb2dpbiBjcmVkZW50aWFscy4nIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2xvZ291dCcpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIFNlc3Npb24uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dvdXRTdWNjZXNzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZSgnU2Vzc2lvbicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBBVVRIX0VWRU5UUykge1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuZGVzdHJveSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKHNlc3Npb25JZCwgdXNlcikge1xuICAgICAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0oKSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdob21lJywge1xuICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9ob21lL2hvbWUuaHRtbCdcbiAgICB9KTtcbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdsb2dpbicsIHtcbiAgICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9sb2dpbi9sb2dpbi5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ3RybCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBBdXRoU2VydmljZSwgJHN0YXRlKSB7XG5cbiAgICAkc2NvcGUubG9naW4gPSB7fTtcbiAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuXG4gICAgJHNjb3BlLnNlbmRMb2dpbiA9IGZ1bmN0aW9uIChsb2dpbkluZm8pIHtcblxuICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuXG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luKGxvZ2luSW5mbykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gJ0ludmFsaWQgbG9naW4gY3JlZGVudGlhbHMuJztcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbWVtYmVyc09ubHknLCB7XG4gICAgICAgIHVybDogJy9tZW1iZXJzLWFyZWEnLFxuICAgICAgICB0ZW1wbGF0ZTogJzxpbWcgbmctcmVwZWF0PVwiaXRlbSBpbiBzdGFzaFwiIHdpZHRoPVwiMzAwXCIgbmctc3JjPVwie3sgaXRlbSB9fVwiIC8+JyxcbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRzY29wZSwgU2VjcmV0U3Rhc2gpIHtcbiAgICAgICAgICAgIFNlY3JldFN0YXNoLmdldFN0YXNoKCkudGhlbihmdW5jdGlvbiAoc3Rhc2gpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3Rhc2ggPSBzdGFzaDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGRhdGEuYXV0aGVudGljYXRlIGlzIHJlYWQgYnkgYW4gZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgLy8gdGhhdCBjb250cm9scyBhY2Nlc3MgdG8gdGhpcyBzdGF0ZS4gUmVmZXIgdG8gYXBwLmpzLlxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBhdXRoZW50aWNhdGU6IHRydWVcbiAgICAgICAgfVxuICAgIH0pO1xuXG59KTtcblxuYXBwLmZhY3RvcnkoJ1NlY3JldFN0YXNoJywgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgICB2YXIgZ2V0U3Rhc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvbWVtYmVycy9zZWNyZXQtc3Rhc2gnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRTdGFzaDogZ2V0U3Rhc2hcbiAgICB9O1xuXG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdxdWVzdGlvbnMnLCB7XG4gICAgICAgIHVybDogJy9kaXNjb3ZlcnknLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3F1ZXN0aW9ucy9xdWVzdGlvbnMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdRdWVzdGlvbkN0cmwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignUXVlc3Rpb25DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBBdXRoU2VydmljZSwgUVN0YWNrRmFjdG9yeSkge1xuICAgIFxuICAgICRzY29wZS5xc3RhY2sgPSBRU3RhY2tGYWN0b3J5LmluaXRpYWxpemUoKTtcbiAgICAkc2NvcGUuY3VycmVudCA9ICRzY29wZS5xc3RhY2suYWR2YW5jZSgpO1xuICAgICRzY29wZS5zZWxlY3RlZCA9IG5ldyBNYXAoJHNjb3BlLnFzdGFjay5kaXNwbGF5ZWQubWFwKG5vZGUgPT4gW25vZGUsIGZhbHNlXSkpO1xuXG4gICAgJHNjb3BlLnNlbGVjdCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkLnNldChub2RlLCAhJHNjb3BlLnNlbGVjdGVkLmdldChub2RlKSlcbiAgICAgICAgcmV0dXJuIG5vZGUuc2VsZWN0Tm9kZSgpO1xuICAgIH1cbiAgICAkc2NvcGUuYWR2YW5jZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoWy4uLiRzY29wZS5zZWxlY3RlZC52YWx1ZXMoKV0uZXZlcnkodmFsdWUgPT4gdmFsdWUgPT09IGZhbHNlKSkgcmV0dXJuO1xuICAgICAgICAkc2NvcGUuY3VycmVudCA9ICRzY29wZS5xc3RhY2suYWR2YW5jZSgpO1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWQuY2xlYXIoKTtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkID0gbmV3IE1hcCgkc2NvcGUucXN0YWNrLmRpc3BsYXllZC5tYXAobm9kZSA9PiBbbm9kZSwgZmFsc2VdKSk7XG4gICAgfVxufSk7XG4iLCJhcHAuZmFjdG9yeSgnRnVsbHN0YWNrUGljcycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3Z0JYdWxDQUFBWFFjRS5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9mYmNkbi1zcGhvdG9zLWMtYS5ha2FtYWloZC5uZXQvaHBob3Rvcy1hay14YXAxL3QzMS4wLTgvMTA4NjI0NTFfMTAyMDU2MjI5OTAzNTkyNDFfODAyNzE2ODg0MzMxMjg0MTEzN19vLmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1MS1VzaElnQUV5OVNLLmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjc5LVg3b0NNQUFrdzd5LmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1VajlDT0lJQUlGQWgwLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjZ5SXlGaUNFQUFxbDEyLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0UtVDc1bFdBQUFtcXFKLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0V2WkFnLVZBQUFrOTMyLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0VnTk1lT1hJQUlmRGhLLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0VReUlETldnQUF1NjBCLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0NGM1Q1UVc4QUUybEdKLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FlVnc1U1dvQUFBTHNqLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FhSklQN1VrQUFsSUdzLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FRT3c5bFdFQUFZOUZsLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1PUWJWckNNQUFOd0lNLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjliX2Vyd0NZQUF3UmNKLnBuZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjVQVGR2bkNjQUVBbDR4LmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjRxd0MwaUNZQUFsUEdoLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjJiMzN2UklVQUE5bzFELmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQndwSXdyMUlVQUF2TzJfLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQnNTc2VBTkNZQUVPaEx3LmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0o0dkxmdVV3QUFkYTRMLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0k3d3pqRVZFQUFPUHBTLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0lkSHZUMlVzQUFubkhWLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0dDaVBfWVdZQUFvNzVWLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0lTNEpQSVdJQUkzN3F1LmpwZzpsYXJnZSdcbiAgICBdO1xufSk7XG4iLCJhcHAuZmFjdG9yeSgnUmFuZG9tR3JlZXRpbmdzJywgZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGdldFJhbmRvbUZyb21BcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgcmV0dXJuIGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKV07XG4gICAgfTtcblxuICAgIHZhciBncmVldGluZ3MgPSBbXG4gICAgICAgICdIZWxsbywgd29ybGQhJyxcbiAgICAgICAgJ0F0IGxvbmcgbGFzdCwgSSBsaXZlIScsXG4gICAgICAgICdIZWxsbywgc2ltcGxlIGh1bWFuLicsXG4gICAgICAgICdXaGF0IGEgYmVhdXRpZnVsIGRheSEnLFxuICAgICAgICAnSVxcJ20gbGlrZSBhbnkgb3RoZXIgcHJvamVjdCwgZXhjZXB0IHRoYXQgSSBhbSB5b3Vycy4gOiknLFxuICAgICAgICAnVGhpcyBlbXB0eSBzdHJpbmcgaXMgZm9yIExpbmRzYXkgTGV2aW5lLicsXG4gICAgICAgICfjgZPjgpPjgavjgaHjga/jgIHjg6bjg7zjgrbjg7zmp5jjgIInLFxuICAgICAgICAnV2VsY29tZS4gVG8uIFdFQlNJVEUuJyxcbiAgICAgICAgJzpEJyxcbiAgICAgICAgJ1llcywgSSB0aGluayB3ZVxcJ3ZlIG1ldCBiZWZvcmUuJyxcbiAgICAgICAgJ0dpbW1lIDMgbWlucy4uLiBJIGp1c3QgZ3JhYmJlZCB0aGlzIHJlYWxseSBkb3BlIGZyaXR0YXRhJyxcbiAgICAgICAgJ0lmIENvb3BlciBjb3VsZCBvZmZlciBvbmx5IG9uZSBwaWVjZSBvZiBhZHZpY2UsIGl0IHdvdWxkIGJlIHRvIG5ldlNRVUlSUkVMIScsXG4gICAgXTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdyZWV0aW5nczogZ3JlZXRpbmdzLFxuICAgICAgICBnZXRSYW5kb21HcmVldGluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldFJhbmRvbUZyb21BcnJheShncmVldGluZ3MpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7XG4iLCJhcHAuZGlyZWN0aXZlKCdmdWxsc3RhY2tMb2dvJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvZnVsbHN0YWNrLWxvZ28vZnVsbHN0YWNrLWxvZ28uaHRtbCdcbiAgICB9O1xufSk7XG4iLCJhcHAuZGlyZWN0aXZlKCduYXZiYXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgQXV0aFNlcnZpY2UsIEFVVEhfRVZFTlRTLCAkc3RhdGUpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2YmFyLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcblxuICAgICAgICAgICAgc2NvcGUuaXRlbXMgPSBbXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ0hvbWUnLCBzdGF0ZTogJ2hvbWUnIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ0Fib3V0Jywgc3RhdGU6ICdhYm91dCcgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiAnRG9jdW1lbnRhdGlvbicsIHN0YXRlOiAnZG9jcycgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiAnTWVtYmVycyBPbmx5Jywgc3RhdGU6ICdtZW1iZXJzT25seScsIGF1dGg6IHRydWUgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgc2NvcGUudXNlciA9IG51bGw7XG5cbiAgICAgICAgICAgIHNjb3BlLmlzTG9nZ2VkSW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHNldFVzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciByZW1vdmVVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLnVzZXIgPSBudWxsO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc2V0VXNlcigpO1xuXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MsIHNldFVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubG9nb3V0U3VjY2VzcywgcmVtb3ZlVXNlcik7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCwgcmVtb3ZlVXNlcik7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxufSk7XG4iLCJhcHAuZGlyZWN0aXZlKCdyYW5kb0dyZWV0aW5nJywgZnVuY3Rpb24gKFJhbmRvbUdyZWV0aW5ncykge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZS5ncmVldGluZyA9IFJhbmRvbUdyZWV0aW5ncy5nZXRSYW5kb21HcmVldGluZygpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
