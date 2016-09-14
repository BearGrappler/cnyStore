'use strict';

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

app.factory('QuestionFactory', function ($http) {

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
        this.selected = [];
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

app.controller('QuestionCtrl', function ($scope, AuthService, QuestionFactory) {
    $scope.qstack = QuestionFactory.initialize();
    $scope.current = $scope.qstack.advance();
    $scope.select = function (node) {
        return node.selectNode();
    };
    $scope.advance = function () {
        $scope.current = $scope.qstack.advance();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiZG9jcy9kb2NzLmpzIiwiZmFjdG9yaWVzL3F1ZXN0aW9uLmZhY3RvcnkuanMiLCJmc2EvZnNhLXByZS1idWlsdC5qcyIsImhvbWUvaG9tZS5qcyIsImxvZ2luL2xvZ2luLmpzIiwibWVtYmVycy1vbmx5L21lbWJlcnMtb25seS5qcyIsInF1ZXN0aW9ucy9xdWVzdGlvbi5qcyIsImNvbW1vbi9mYWN0b3JpZXMvRnVsbHN0YWNrUGljcy5qcyIsImNvbW1vbi9mYWN0b3JpZXMvUmFuZG9tR3JlZXRpbmdzLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvZnVsbHN0YWNrLWxvZ28vZnVsbHN0YWNrLWxvZ28uanMiLCJjb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2YmFyLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvcmFuZG8tZ3JlZXRpbmcvcmFuZG8tZ3JlZXRpbmcuanMiXSwibmFtZXMiOlsid2luZG93IiwiYXBwIiwiYW5ndWxhciIsIm1vZHVsZSIsImNvbmZpZyIsIiR1cmxSb3V0ZXJQcm92aWRlciIsIiRsb2NhdGlvblByb3ZpZGVyIiwiaHRtbDVNb2RlIiwib3RoZXJ3aXNlIiwid2hlbiIsImxvY2F0aW9uIiwicmVsb2FkIiwicnVuIiwiJHJvb3RTY29wZSIsIkF1dGhTZXJ2aWNlIiwiJHN0YXRlIiwiZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCIsInN0YXRlIiwiZGF0YSIsImF1dGhlbnRpY2F0ZSIsIiRvbiIsImV2ZW50IiwidG9TdGF0ZSIsInRvUGFyYW1zIiwiaXNBdXRoZW50aWNhdGVkIiwicHJldmVudERlZmF1bHQiLCJnZXRMb2dnZWRJblVzZXIiLCJ0aGVuIiwidXNlciIsImdvIiwibmFtZSIsIiRzdGF0ZVByb3ZpZGVyIiwidXJsIiwiY29udHJvbGxlciIsInRlbXBsYXRlVXJsIiwiJHNjb3BlIiwiRnVsbHN0YWNrUGljcyIsImltYWdlcyIsIl8iLCJzaHVmZmxlIiwiZmFjdG9yeSIsIiRodHRwIiwicXVlc3Rpb25zIiwiaG9tZSIsIlF1ZXN0aW9ubmFpcmUiLCJkZXNrdG9wIiwiY29tcHV0ZXIiLCJsYXB0b3AiLCJnYW1lciIsInR5cGUiLCJhcnRpc3QiLCJzdHVkZW50IiwiY2FzdWFsIiwiZ2FtZXJHZW5yZVJUUyIsImNwdSIsInJhbSIsImdwdSIsImdhbWVyR2VucmVSUEciLCJnYW1lckdlbnJlRlBTIiwiZ2FtZXJHZW5yZUlORElFIiwiYXJ0aXN0R2VucmVBdWRpbyIsImFydGlzdEdlbnJlVmlkZW8iLCJhcnRpc3RHZW5yZVBob3RvIiwic3R1ZGVudE1ham9yU1RFTSIsInN0dWRlbnRNYWpvclRyYWRlIiwic3R1ZGVudE1ham9yTGliQXJ0cyIsInN0dWRlbnRNYWpvclNwb3J0cyIsInByaWNlIiwic3BlZWQiLCJoZGQiLCJncmFwaGljcyIsInNwYWNlIiwicm91bmRlZCIsImRlZmF1bHRGaWx0ZXJzIiwicHJpb3JpdHkiLCJwcm9jZXNzb3IiLCJpZCIsImxhYmVsIiwicXVlc3Rpb24iLCJmaWx0ZXJzT2JqIiwiZmlsdGVycyIsImFuc3dlcnMiLCJwYXJlbnQiLCJzZWxlY3RlZCIsInByb3RvdHlwZSIsImFkZEFuc3dlciIsIm5vZGUiLCJwdXNoIiwiY2hhaW5BbnN3ZXIiLCJmb3JFYWNoIiwiYW5zd2VyIiwic2VsZWN0Tm9kZSIsImNvbnNvbGUiLCJsb2ciLCJRdWVzdGlvblN0YWNrIiwicm9vdE5vZGUiLCJzdGFjayIsImRpc3BsYXllZCIsImN1cnJlbnRGaWx0ZXJzIiwiT2JqZWN0IiwiYXNzaWduIiwiYWRkIiwibm9kZXMiLCJBcnJheSIsImlzQXJyYXkiLCJvYmoiLCJrZXlzIiwiaGFzT3duUHJvcGVydHkiLCJrZXkiLCJhZHZhbmNlIiwiZmlsdGVyIiwibGVuZ3RoIiwibmV4dE5vZGUiLCJwb3AiLCJzZXRTdGFjayIsImZpbmROb2RlQnlJZCIsImluaXRpYWxpemUiLCJFcnJvciIsImlvIiwib3JpZ2luIiwiY29uc3RhbnQiLCJsb2dpblN1Y2Nlc3MiLCJsb2dpbkZhaWxlZCIsImxvZ291dFN1Y2Nlc3MiLCJzZXNzaW9uVGltZW91dCIsIm5vdEF1dGhlbnRpY2F0ZWQiLCJub3RBdXRob3JpemVkIiwiJHEiLCJBVVRIX0VWRU5UUyIsInN0YXR1c0RpY3QiLCJyZXNwb25zZUVycm9yIiwicmVzcG9uc2UiLCIkYnJvYWRjYXN0Iiwic3RhdHVzIiwicmVqZWN0IiwiJGh0dHBQcm92aWRlciIsImludGVyY2VwdG9ycyIsIiRpbmplY3RvciIsImdldCIsInNlcnZpY2UiLCJTZXNzaW9uIiwib25TdWNjZXNzZnVsTG9naW4iLCJjcmVhdGUiLCJmcm9tU2VydmVyIiwiY2F0Y2giLCJsb2dpbiIsImNyZWRlbnRpYWxzIiwicG9zdCIsIm1lc3NhZ2UiLCJsb2dvdXQiLCJkZXN0cm95Iiwic2VsZiIsInNlc3Npb25JZCIsImVycm9yIiwic2VuZExvZ2luIiwibG9naW5JbmZvIiwidGVtcGxhdGUiLCJTZWNyZXRTdGFzaCIsImdldFN0YXNoIiwic3Rhc2giLCJRdWVzdGlvbkZhY3RvcnkiLCJxc3RhY2siLCJjdXJyZW50Iiwic2VsZWN0IiwiZ2V0UmFuZG9tRnJvbUFycmF5IiwiYXJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZ3JlZXRpbmdzIiwiZ2V0UmFuZG9tR3JlZXRpbmciLCJkaXJlY3RpdmUiLCJyZXN0cmljdCIsInNjb3BlIiwibGluayIsIml0ZW1zIiwiYXV0aCIsImlzTG9nZ2VkSW4iLCJzZXRVc2VyIiwicmVtb3ZlVXNlciIsIlJhbmRvbUdyZWV0aW5ncyIsImdyZWV0aW5nIl0sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQUEsT0FBQUMsR0FBQSxHQUFBQyxRQUFBQyxNQUFBLENBQUEsdUJBQUEsRUFBQSxDQUFBLGFBQUEsRUFBQSxXQUFBLEVBQUEsY0FBQSxFQUFBLFdBQUEsQ0FBQSxDQUFBOztBQUVBRixJQUFBRyxNQUFBLENBQUEsVUFBQUMsa0JBQUEsRUFBQUMsaUJBQUEsRUFBQTtBQUNBO0FBQ0FBLHNCQUFBQyxTQUFBLENBQUEsSUFBQTtBQUNBO0FBQ0FGLHVCQUFBRyxTQUFB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PSBhbmd1bGFyLm1vZHVsZSgnRnVsbHN0YWNrR2VuZXJhdGVkQXBwJywgWydmc2FQcmVCdWlsdCcsICd1aS5yb3V0ZXInLCAndWkuYm9vdHN0cmFwJywgJ25nQW5pbWF0ZSddKTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgLy8gSWYgd2UgZ28gdG8gYSBVUkwgdGhhdCB1aS1yb3V0ZXIgZG9lc24ndCBoYXZlIHJlZ2lzdGVyZWQsIGdvIHRvIHRoZSBcIi9cIiB1cmwuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuICAgIC8vIFRyaWdnZXIgcGFnZSByZWZyZXNoIHdoZW4gYWNjZXNzaW5nIGFuIE9BdXRoIHJvdXRlXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJy9hdXRoLzpwcm92aWRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xufSk7XG5cbi8vIFRoaXMgYXBwLnJ1biBpcyBmb3IgY29udHJvbGxpbmcgYWNjZXNzIHRvIHNwZWNpZmljIHN0YXRlcy5cbmFwcC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsIEF1dGhTZXJ2aWNlLCAkc3RhdGUpIHtcblxuICAgIC8vIFRoZSBnaXZlbiBzdGF0ZSByZXF1aXJlcyBhbiBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAgdmFyIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGggPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLmRhdGEgJiYgc3RhdGUuZGF0YS5hdXRoZW50aWNhdGU7XG4gICAgfTtcblxuICAgIC8vICRzdGF0ZUNoYW5nZVN0YXJ0IGlzIGFuIGV2ZW50IGZpcmVkXG4gICAgLy8gd2hlbmV2ZXIgdGhlIHByb2Nlc3Mgb2YgY2hhbmdpbmcgYSBzdGF0ZSBiZWdpbnMuXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcykge1xuXG4gICAgICAgIGlmICghZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCh0b1N0YXRlKSkge1xuICAgICAgICAgICAgLy8gVGhlIGRlc3RpbmF0aW9uIHN0YXRlIGRvZXMgbm90IHJlcXVpcmUgYXV0aGVudGljYXRpb25cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgIC8vIFRoZSB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQuXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2FuY2VsIG5hdmlnYXRpbmcgdG8gbmV3IHN0YXRlLlxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgIC8vIElmIGEgdXNlciBpcyByZXRyaWV2ZWQsIHRoZW4gcmVuYXZpZ2F0ZSB0byB0aGUgZGVzdGluYXRpb25cbiAgICAgICAgICAgIC8vICh0aGUgc2Vjb25kIHRpbWUsIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpIHdpbGwgd29yaylcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSwgaWYgbm8gdXNlciBpcyBsb2dnZWQgaW4sIGdvIHRvIFwibG9naW5cIiBzdGF0ZS5cbiAgICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKHRvU3RhdGUubmFtZSwgdG9QYXJhbXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqYWJvdXQqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhYm91dCcsIHtcbiAgICAgICAgdXJsOiAnL2Fib3V0JyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWJvdXQvYWJvdXQuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBYm91dENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBGdWxsc3RhY2tQaWNzKSB7XG5cbiAgICAvLyBJbWFnZXMgb2YgYmVhdXRpZnVsIEZ1bGxzdGFjayBwZW9wbGUuXG4gICAgJHNjb3BlLmltYWdlcyA9IF8uc2h1ZmZsZShGdWxsc3RhY2tQaWNzKTtcblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdkb2NzJywge1xuICAgICAgICB1cmw6ICcvZG9jcycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvZG9jcy9kb2NzLmh0bWwnXG4gICAgfSk7XG59KTtcbiIsImFwcC5mYWN0b3J5KCdRdWVzdGlvbkZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCkge1xuXG4gICAgbGV0IHF1ZXN0aW9ucyA9IHtcbiAgICAgICAgaG9tZTogbmV3IFF1ZXN0aW9ubmFpcmUoMCwgJ0hvbWUnLCAnV2hpY2ggdHlwZSBvZiBjb21wdXRlciBhcmUgeW91IGxvb2tpbmcgZm9yPycsIHt9KSxcbiAgICAgICAgZGVza3RvcDogbmV3IFF1ZXN0aW9ubmFpcmUoMSwgJ0Rlc2t0b3AnLCAnV2hpY2ggdHlwZSBvZiB1c2VyIGFyZSB5b3U/JywgeyBjb21wdXRlcjogJ2Rlc2t0b3AnIH0pLFxuICAgICAgICBsYXB0b3A6IG5ldyBRdWVzdGlvbm5haXJlKDIsICdMYXB0b3AnLCAnV2hpY2ggdHlwZSBvZiB1c2VyIGFyZSB5b3U/JywgeyBjb21wdXRlcjogJ2xhcHRvcCcgfSksXG4gICAgICAgIGdhbWVyOiBuZXcgUXVlc3Rpb25uYWlyZSgzLCAnR2FtZXInLCAnU2VsZWN0IHlvdXIgZmF2b3JpdGUgZ2VucmVzJywgeyB0eXBlOiAnZ2FtZXInIH0pLFxuICAgICAgICBhcnRpc3Q6IG5ldyBRdWVzdGlvbm5haXJlKDQsICdBcnRpc3QnLCAnRG8geW91IHdvcmsgd2l0aCBhdWRpbz8gVmlkZW8/IE1vcmUgY3JlYXRpdmUgbWVkaWE/JywgeyB0eXBlOiAnYXJ0aXN0JyB9KSxcbiAgICAgICAgc3R1ZGVudDogbmV3IFF1ZXN0aW9ubmFpcmUoNSwgJ1N0dWRlbnQnLCAnV2hhdCBhcmUgeW91IHN0dWR5aW5nPycsIHsgdHlwZTogJ3N0dWRlbnQnIH0pLFxuICAgICAgICBjYXN1YWw6IG5ldyBRdWVzdGlvbm5haXJlKDYsICdDYXN1YWwnLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IHR5cGU6ICdjYXN1YWwnIH0pLFxuXG4gICAgICAgIGdhbWVyR2VucmVSVFM6IG5ldyBRdWVzdGlvbm5haXJlKDcsICdTdHJhdGVneScsIFwiV2hhdCdzIGltcG9ydGFudCB0byB5b3U/XCIsIHsgY3B1OiAnNCcsIHJhbTogJzQnLCBncHU6ICcyJyB9KSxcbiAgICAgICAgZ2FtZXJHZW5yZVJQRzogbmV3IFF1ZXN0aW9ubmFpcmUoOCwgJ1JvbGUgUGxheWluZyBHYW1lcycsIFwiV2hhdCdzIGltcG9ydGFudCB0byB5b3U/XCIsIHsgY3B1OiAnNCcsIHJhbTogJzMnLCBncHU6ICc0JyB9KSxcbiAgICAgICAgZ2FtZXJHZW5yZUZQUzogbmV3IFF1ZXN0aW9ubmFpcmUoOSwgJ0ZQUy9BY3Rpb24nLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IGNwdTogJzQnLCByYW06ICczJywgZ3B1OiAnNCcgfSksXG4gICAgICAgIGdhbWVyR2VucmVJTkRJRTogbmV3IFF1ZXN0aW9ubmFpcmUoMTAsICdJbmRpZScsIFwiV2hhdCdzIGltcG9ydGFudCB0byB5b3U/XCIsIHsgY3B1OiAnMicsIHJhbTogJzInLCBncHU6ICcyJyB9KSxcblxuICAgICAgICBhcnRpc3RHZW5yZUF1ZGlvOiBuZXcgUXVlc3Rpb25uYWlyZSgxMSwgJ0F1ZGlvJywgXCJXaGF0J3MgaW1wb3J0YW50IHRvIHlvdT9cIiwgeyBjcHU6ICc0JywgcmFtOiAnMycsIGdwdTogJzAnIH0pLFxuICAgICAgICBhcnRpc3RHZW5yZVZpZGVvOiBuZXcgUXVlc3Rpb25uYWlyZSgxMiwgJ1ZpZGVvJywgXCJXaGF0J3MgaW1wb3J0YW50IHRvIHlvdT9cIiwgeyBjcHU6ICc0JywgcmFtOiAnMycsIGdwdTogJzEnIH0pLFxuICAgICAgICBhcnRpc3RHZW5yZVBob3RvOiBuZXcgUXVlc3Rpb25uYWlyZSgxMywgJ1Bob3RvJywgXCJXaGF0J3MgaW1wb3J0YW50IHRvIHlvdT9cIiwgeyBjcHU6ICczJywgcmFtOiAnMicsIGdwdTogJzAnIH0pLFxuXG4gICAgICAgIHN0dWRlbnRNYWpvclNURU06IG5ldyBRdWVzdGlvbm5haXJlKDE0LCAnU2NpZW5jZS9UZWNobm9sb2d5L01hdGgnLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IGNwdTogJzMnLCByYW06ICcyJywgZ3B1OiAnMScgfSksXG4gICAgICAgIHN0dWRlbnRNYWpvclRyYWRlOiBuZXcgUXVlc3Rpb25uYWlyZSgxNSwgJ1RyYWRlIFNjaG9vbCcsIFwiV2hhdCdzIGltcG9ydGFudCB0byB5b3U/XCIsIHsgY3B1OiAnMScsIHJhbTogJzEnLCBncHU6ICcwJyB9KSxcbiAgICAgICAgc3R1ZGVudE1ham9yTGliQXJ0czogbmV3IFF1ZXN0aW9ubmFpcmUoMTYsICdMaWJlcmFsIEFydHMnLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IGNwdTogJzInLCByYW06ICcyJywgZ3B1OiAnMCcgfSksXG4gICAgICAgIHN0dWRlbnRNYWpvclNwb3J0czogbmV3IFF1ZXN0aW9ubmFpcmUoMTcsICdTcG9ydHMnLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IGNwdTogJzEnLCByYW06ICcyJywgZ3B1OiAnMCcgfSksXG5cbiAgICAgICAgcHJpY2U6IG5ldyBRdWVzdGlvbm5haXJlKDE4LCAnUHJpY2UnLCAnJywgeyBwcmljZTogJzEnIH0pLFxuICAgICAgICBzcGVlZDogbmV3IFF1ZXN0aW9ubmFpcmUoMTksICdTcGVlZCcsICcnLCB7IGNwdTogJzMnLCByYW06ICcyJywgZ3B1OiAnMCcsIGhkZDogJzQnLCBwcmljZTogJzUnIH0pLFxuICAgICAgICBncmFwaGljczogbmV3IFF1ZXN0aW9ubmFpcmUoMjAsICdHcmFwaGljcycsICcnLCB7IGdwdTogJzUnLCBwcmljZTogJzQnIH0pLFxuICAgICAgICBzcGFjZTogbmV3IFF1ZXN0aW9ubmFpcmUoMjEsICdTcGFjZScsICcnLCB7IGhkZDogJzUnLCBwcmljZTogJzMnIH0pLFxuICAgICAgICByb3VuZGVkOiBuZXcgUXVlc3Rpb25uYWlyZSgyMiwgJ1dlbGwtUm91bmRlZCcsICcnLCB7IGNwdTogJzInLCByYW06ICcyJywgZ3B1OiAnMicsIGhkZDogJzInLCBwcmljZTogJzInIH0pLFxuICAgIH07XG5cbiAgICBsZXQgZGVmYXVsdEZpbHRlcnMgPSB7XG4gICAgICAgIGNvbXB1dGVyOiBbXSxcbiAgICAgICAgdHlwZTogW10sXG4gICAgICAgIHByaWNlOiBbXSxcbiAgICAgICAgcHJpb3JpdHk6IFtdLFxuICAgICAgICBwcm9jZXNzb3I6IFtdLFxuICAgICAgICByYW06IFtdLFxuICAgICAgICBoZGQ6IFtdLFxuICAgICAgICBjcHU6IFtdLFxuICAgICAgICBncHU6IFtdXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFF1ZXN0aW9ubmFpcmUgVHJlZSBDb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7W051bWJlcl19IGlkICAgICAgICAgW0ludGVnZXIga2V5IGZvciB0aGUgbm9kZSAoZW5hYmxlcyBsb29rdXApXVxuICAgICAqIEBwYXJhbSB7W1N0cmluZ119IGxhYmVsICAgICAgW0Rlc2NyaXB0b3IgdG8gZGlzcGxheSBvbiBzZWxlY3RvciBlbGVtZW50XVxuICAgICAqIEBwYXJhbSB7W1N0cmluZ119IHF1ZXN0aW9uICAgW1F1ZXN0aW9uIHRvIGRpc3BsYXkgdG8gdXNlciAoYW5zd2VyIHNlbGVjdG9ycyBhcmUgaW4gdGhpcy5hbnN3ZXJzKV1cbiAgICAgKiBAcGFyYW0ge1tPYmplY3RdfSBmaWx0ZXJzT2JqIFtGaWx0ZXJzIHRvIGFwcGx5IGJhc2VkIG9uIGFuc3dlciBjaG9pY2VdXG4gICAgICovXG4gICAgZnVuY3Rpb24gUXVlc3Rpb25uYWlyZShpZCwgbGFiZWwsIHF1ZXN0aW9uLCBmaWx0ZXJzT2JqKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHF1ZXN0aW9uO1xuICAgICAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgICAgIHRoaXMuZmlsdGVycyA9IGZpbHRlcnNPYmpcbiAgICAgICAgdGhpcy5hbnN3ZXJzID0gW107XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIFF1ZXN0aW9ubmFpcmUucHJvdG90eXBlLmFkZEFuc3dlciA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSB0aGlzO1xuICAgICAgICB0aGlzLmFuc3dlcnMucHVzaChub2RlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBRdWVzdGlvbm5haXJlLnByb3RvdHlwZS5jaGFpbkFuc3dlciA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgdGhpcy5hbnN3ZXJzLmZvckVhY2goYW5zd2VyID0+IHtcbiAgICAgICAgICAgIGFuc3dlci5hZGRBbnN3ZXIobm9kZSlcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIFF1ZXN0aW9ubmFpcmUucHJvdG90eXBlLnNlbGVjdE5vZGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9ICF0aGlzLnNlbGVjdGVkO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmxhYmVsLCB0aGlzLnNlbGVjdGVkID8gJ29uJyA6ICdvZmYnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBRdWVzdGlvblN0YWNrIFN0YWNrIENvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtbUXVlc3Rpb25uYWlyZV19IHJvb3ROb2RlIFtUaGUgcm9vdCBub2RlIG9mIHRoZSBxdWVzdGlvbiB0cmVlIChzaG91bGQgYmUgJ2hvbWUnIG5vZGUgLSBJRDogMSldXG4gICAgICogQHBhcmFtIHtbT2JqZWN0XX0gICAgICAgIGZpbHRlcnMgIFtGaWx0ZXJzIHRvIGxvYWQgLSBjYW4gcmV0cmlldmUgZmlsdGVycyBmcm9tIENhcnQgZW50cnkgaW4gREJdXG4gICAgICovXG4gICAgZnVuY3Rpb24gUXVlc3Rpb25TdGFjayhyb290Tm9kZSwgZmlsdGVycykge1xuICAgICAgICB0aGlzLnN0YWNrID0gW107XG4gICAgICAgIHRoaXMuZGlzcGxheWVkID0gW107XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBbXTtcbiAgICAgICAgdGhpcy5jdXJyZW50RmlsdGVycyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRGaWx0ZXJzLCBmaWx0ZXJzKTtcbiAgICAgICAgdGhpcy5yb290Tm9kZSA9IHJvb3ROb2RlO1xuICAgIH1cblxuICAgIFF1ZXN0aW9uU3RhY2sucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG5vZGVzKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KG5vZGVzKSkge1xuICAgICAgICAgICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHRoaXMuc3RhY2sucHVzaChub2RlKSk7XG4gICAgICAgIH0gZWxzZSB7IHRoaXMuc3RhY2sucHVzaChub2Rlcyk7IH1cbiAgICB9XG5cbiAgICBRdWVzdGlvblN0YWNrLnByb3RvdHlwZS5hc3NpZ24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgICAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRGaWx0ZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRGaWx0ZXJzW2tleV0ucHVzaChvYmpba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgUXVlc3Rpb25TdGFjay5wcm90b3R5cGUuYWR2YW5jZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5kaXNwbGF5ZWQuZmlsdGVyKG5vZGUgPT4gbm9kZS5zZWxlY3RlZCk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgIG5vZGUuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChub2RlLmFuc3dlcnMubGVuZ3RoKSB0aGlzLmFkZChub2RlKTtcbiAgICAgICAgICAgIHRoaXMuYXNzaWduKG5vZGUuZmlsdGVycyk7XG4gICAgICAgIH0pXG4gICAgICAgIGxldCBuZXh0Tm9kZSA9IHRoaXMuc3RhY2subGVuZ3RoID4gMCA/IHRoaXMuc3RhY2sucG9wKCkgOiBudWxsO1xuICAgICAgICB0aGlzLmRpc3BsYXllZCA9IG5leHROb2RlID8gbmV4dE5vZGUuYW5zd2VycyA6IFtdO1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gW107XG4gICAgICAgIHJldHVybiBuZXh0Tm9kZTtcbiAgICB9XG5cbiAgICBRdWVzdGlvblN0YWNrLnByb3RvdHlwZS5zZXRTdGFjayA9IGZ1bmN0aW9uKG9iaiwgZmlsdGVycyA9IHt9KSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHRoaXMuc3RhY2sgPSBvYmo7XG4gICAgICAgIGVsc2UgdGhpcy5zdGFjayA9IFtvYmpdO1xuICAgICAgICB0aGlzLmRpc3BsYXllZCA9IG9iai5hbnN3ZXJzO1xuICAgICAgICB0aGlzLmFzc2lnbihmaWx0ZXJzKTtcbiAgICB9XG5cbiAgICBRdWVzdGlvblN0YWNrLnByb3RvdHlwZS5maW5kTm9kZUJ5SWQgPSBmdW5jdGlvbihub2RlLCBpZCkge1xuICAgICAgICBpZiAoIW5vZGUpIG5vZGUgPSB0aGlzLnJvb3ROb2RlO1xuICAgICAgICBpZiAobm9kZS5pZCA9PT0gaWQpIHRoaXMuc2V0U3RhY2sobm9kZSk7XG4gICAgICAgIGVsc2Ugbm9kZS5hbnN3ZXJzLmZvckVhY2goYW5zd2VyID0+IFF1ZXN0aW9ubmFpcmUuZmluZE5vZGVCeUlkKGFuc3dlciwgaWQpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyB0cmVlIHN0cnVjdHVyZS9hc3NvY2lhdGlvbnMgZm9yIHF1ZXN0aW9ubmFpcmUuXG4gICAgICogQHJldHVybiB7W3VuZGVmaW5lZF19IFtOb3RoaW5nIHJldHVybmVkXVxuICAgICAqL1xuICAgIFF1ZXN0aW9uU3RhY2sucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcXVlc3Rpb25zLmhvbWUuYWRkQW5zd2VyKHF1ZXN0aW9ucy5kZXNrdG9wKTtcbiAgICAgICAgcXVlc3Rpb25zLmhvbWUuYWRkQW5zd2VyKHF1ZXN0aW9ucy5sYXB0b3ApO1xuXG4gICAgICAgIHF1ZXN0aW9ucy5kZXNrdG9wXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5nYW1lcilcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmFydGlzdClcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLnN0dWRlbnQpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5jYXN1YWwpO1xuXG4gICAgICAgIHF1ZXN0aW9ucy5sYXB0b3BcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmdhbWVyKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuYXJ0aXN0KVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuc3R1ZGVudClcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmNhc3VhbCk7XG5cbiAgICAgICAgcXVlc3Rpb25zLmdhbWVyXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5nYW1lckdlbnJlUlRTKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuZ2FtZXJHZW5yZUlORElFKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuZ2FtZXJHZW5yZUZQUylcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmdhbWVyR2VucmVSUEcpO1xuXG4gICAgICAgIHF1ZXN0aW9ucy5nYW1lclxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5wcmljZSlcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMuc3BlZWQpXG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLmdyYXBoaWNzKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5zcGFjZSlcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMucm91bmRlZCk7XG5cbiAgICAgICAgcXVlc3Rpb25zLmFydGlzdFxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuYXJ0aXN0R2VucmVQaG90bylcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmFydGlzdEdlbnJlQXVkaW8pXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5hcnRpc3RHZW5yZVZpZGVvKTtcblxuICAgICAgICBxdWVzdGlvbnMuYXJ0aXN0XG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLnByaWNlKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5zcGVlZClcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMuZ3JhcGhpY3MpXG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLnNwYWNlKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5yb3VuZGVkKTtcblxuICAgICAgICBxdWVzdGlvbnMuc3R1ZGVudFxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuc3R1ZGVudE1ham9yU1RFTSlcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLnN0dWRlbnRNYWpvclRyYWRlKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuc3R1ZGVudE1ham9yU3BvcnRzKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuc3R1ZGVudE1ham9yTGliQXJ0cyk7XG4gICAgICAgIHF1ZXN0aW9ucy5zdHVkZW50XG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLnByaWNlKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5zcGVlZClcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMuZ3JhcGhpY3MpXG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLnNwYWNlKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5yb3VuZGVkKTtcblxuICAgICAgICBxdWVzdGlvbnMuY2FzdWFsXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5wcmljZSlcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLnNwZWVkKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuZ3JhcGhpY3MpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5zcGFjZSlcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLnJvdW5kZWQpO1xuXG5cbiAgICAgICAgdGhpcy5zZXRTdGFjayh0aGlzLnJvb3ROb2RlKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFF1ZXN0aW9uU3RhY2socXVlc3Rpb25zLmhvbWUpO1xuXG59KTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBIb3BlIHlvdSBkaWRuJ3QgZm9yZ2V0IEFuZ3VsYXIhIER1aC1kb3kuXG4gICAgaWYgKCF3aW5kb3cuYW5ndWxhcikgdGhyb3cgbmV3IEVycm9yKCdJIGNhblxcJ3QgZmluZCBBbmd1bGFyIScpO1xuXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdmc2FQcmVCdWlsdCcsIFtdKTtcblxuICAgIGFwcC5mYWN0b3J5KCdTb2NrZXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghd2luZG93LmlvKSB0aHJvdyBuZXcgRXJyb3IoJ3NvY2tldC5pbyBub3QgZm91bmQhJyk7XG4gICAgICAgIHJldHVybiB3aW5kb3cuaW8od2luZG93LmxvY2F0aW9uLm9yaWdpbik7XG4gICAgfSk7XG5cbiAgICAvLyBBVVRIX0VWRU5UUyBpcyB1c2VkIHRocm91Z2hvdXQgb3VyIGFwcCB0b1xuICAgIC8vIGJyb2FkY2FzdCBhbmQgbGlzdGVuIGZyb20gYW5kIHRvIHRoZSAkcm9vdFNjb3BlXG4gICAgLy8gZm9yIGltcG9ydGFudCBldmVudHMgYWJvdXQgYXV0aGVudGljYXRpb24gZmxvdy5cbiAgICBhcHAuY29uc3RhbnQoJ0FVVEhfRVZFTlRTJywge1xuICAgICAgICBsb2dpblN1Y2Nlc3M6ICdhdXRoLWxvZ2luLXN1Y2Nlc3MnLFxuICAgICAgICBsb2dpbkZhaWxlZDogJ2F1dGgtbG9naW4tZmFpbGVkJyxcbiAgICAgICAgbG9nb3V0U3VjY2VzczogJ2F1dGgtbG9nb3V0LXN1Y2Nlc3MnLFxuICAgICAgICBzZXNzaW9uVGltZW91dDogJ2F1dGgtc2Vzc2lvbi10aW1lb3V0JyxcbiAgICAgICAgbm90QXV0aGVudGljYXRlZDogJ2F1dGgtbm90LWF1dGhlbnRpY2F0ZWQnLFxuICAgICAgICBub3RBdXRob3JpemVkOiAnYXV0aC1ub3QtYXV0aG9yaXplZCdcbiAgICB9KTtcblxuICAgIGFwcC5mYWN0b3J5KCdBdXRoSW50ZXJjZXB0b3InLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHEsIEFVVEhfRVZFTlRTKSB7XG4gICAgICAgIHZhciBzdGF0dXNEaWN0ID0ge1xuICAgICAgICAgICAgNDAxOiBBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLFxuICAgICAgICAgICAgNDAzOiBBVVRIX0VWRU5UUy5ub3RBdXRob3JpemVkLFxuICAgICAgICAgICAgNDE5OiBBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCxcbiAgICAgICAgICAgIDQ0MDogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXRcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChzdGF0dXNEaWN0W3Jlc3BvbnNlLnN0YXR1c10sIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgYXBwLmNvbmZpZyhmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFtcbiAgICAgICAgICAgICckaW5qZWN0b3InLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZSgnQXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsIFNlc3Npb24sICRyb290U2NvcGUsIEFVVEhfRVZFTlRTLCAkcSkge1xuXG4gICAgICAgIGZ1bmN0aW9uIG9uU3VjY2Vzc2Z1bExvZ2luKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB2YXIgdXNlciA9IHJlc3BvbnNlLmRhdGEudXNlcjtcbiAgICAgICAgICAgIFNlc3Npb24uY3JlYXRlKHVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ2luU3VjY2Vzcyk7XG4gICAgICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVzZXMgdGhlIHNlc3Npb24gZmFjdG9yeSB0byBzZWUgaWYgYW5cbiAgICAgICAgLy8gYXV0aGVudGljYXRlZCB1c2VyIGlzIGN1cnJlbnRseSByZWdpc3RlcmVkLlxuICAgICAgICB0aGlzLmlzQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAhIVNlc3Npb24udXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdldExvZ2dlZEluVXNlciA9IGZ1bmN0aW9uIChmcm9tU2VydmVyKSB7XG5cbiAgICAgICAgICAgIC8vIElmIGFuIGF1dGhlbnRpY2F0ZWQgc2Vzc2lvbiBleGlzdHMsIHdlXG4gICAgICAgICAgICAvLyByZXR1cm4gdGhlIHVzZXIgYXR0YWNoZWQgdG8gdGhhdCBzZXNzaW9uXG4gICAgICAgICAgICAvLyB3aXRoIGEgcHJvbWlzZS4gVGhpcyBlbnN1cmVzIHRoYXQgd2UgY2FuXG4gICAgICAgICAgICAvLyBhbHdheXMgaW50ZXJmYWNlIHdpdGggdGhpcyBtZXRob2QgYXN5bmNocm9ub3VzbHkuXG5cbiAgICAgICAgICAgIC8vIE9wdGlvbmFsbHksIGlmIHRydWUgaXMgZ2l2ZW4gYXMgdGhlIGZyb21TZXJ2ZXIgcGFyYW1ldGVyLFxuICAgICAgICAgICAgLy8gdGhlbiB0aGlzIGNhY2hlZCB2YWx1ZSB3aWxsIG5vdCBiZSB1c2VkLlxuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0F1dGhlbnRpY2F0ZWQoKSAmJiBmcm9tU2VydmVyICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oU2Vzc2lvbi51c2VyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTWFrZSByZXF1ZXN0IEdFVCAvc2Vzc2lvbi5cbiAgICAgICAgICAgIC8vIElmIGl0IHJldHVybnMgYSB1c2VyLCBjYWxsIG9uU3VjY2Vzc2Z1bExvZ2luIHdpdGggdGhlIHJlc3BvbnNlLlxuICAgICAgICAgICAgLy8gSWYgaXQgcmV0dXJucyBhIDQwMSByZXNwb25zZSwgd2UgY2F0Y2ggaXQgYW5kIGluc3RlYWQgcmVzb2x2ZSB0byBudWxsLlxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3Nlc3Npb24nKS50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvbG9naW4nLCBjcmVkZW50aWFscylcbiAgICAgICAgICAgICAgICAudGhlbihvblN1Y2Nlc3NmdWxMb2dpbilcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHsgbWVzc2FnZTogJ0ludmFsaWQgbG9naW4gY3JlZGVudGlhbHMuJyB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9sb2dvdXQnKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBTZXNzaW9uLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9nb3V0U3VjY2Vzcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG4gICAgYXBwLnNlcnZpY2UoJ1Nlc3Npb24nLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgQVVUSF9FVkVOVFMpIHtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcblxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChzZXNzaW9uSWQsIHVzZXIpIHtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KCkpO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaG9tZS9ob21lLmh0bWwnXG4gICAgfSk7XG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvbG9naW4vbG9naW4uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgQXV0aFNlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgJHNjb3BlLmxvZ2luID0ge307XG4gICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5zZW5kTG9naW4gPSBmdW5jdGlvbiAobG9naW5JbmZvKSB7XG5cbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbihsb2dpbkluZm8pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLic7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21lbWJlcnNPbmx5Jywge1xuICAgICAgICB1cmw6ICcvbWVtYmVycy1hcmVhJyxcbiAgICAgICAgdGVtcGxhdGU6ICc8aW1nIG5nLXJlcGVhdD1cIml0ZW0gaW4gc3Rhc2hcIiB3aWR0aD1cIjMwMFwiIG5nLXNyYz1cInt7IGl0ZW0gfX1cIiAvPicsXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsIFNlY3JldFN0YXNoKSB7XG4gICAgICAgICAgICBTZWNyZXRTdGFzaC5nZXRTdGFzaCgpLnRoZW4oZnVuY3Rpb24gKHN0YXNoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnN0YXNoID0gc3Rhc2g7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBkYXRhLmF1dGhlbnRpY2F0ZSBpcyByZWFkIGJ5IGFuIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgIC8vIHRoYXQgY29udHJvbHMgYWNjZXNzIHRvIHRoaXMgc3RhdGUuIFJlZmVyIHRvIGFwcC5qcy5cbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgYXV0aGVudGljYXRlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9KTtcblxufSk7XG5cbmFwcC5mYWN0b3J5KCdTZWNyZXRTdGFzaCcsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gICAgdmFyIGdldFN0YXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL21lbWJlcnMvc2VjcmV0LXN0YXNoJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0U3Rhc2g6IGdldFN0YXNoXG4gICAgfTtcblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncXVlc3Rpb25zJywge1xuICAgICAgICB1cmw6ICcvZGlzY292ZXJ5JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9xdWVzdGlvbnMvcXVlc3Rpb25zLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnUXVlc3Rpb25DdHJsJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1F1ZXN0aW9uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgQXV0aFNlcnZpY2UsIFF1ZXN0aW9uRmFjdG9yeSkge1xuICAgICRzY29wZS5xc3RhY2sgPSBRdWVzdGlvbkZhY3RvcnkuaW5pdGlhbGl6ZSgpO1xuICAgICRzY29wZS5jdXJyZW50ID0gJHNjb3BlLnFzdGFjay5hZHZhbmNlKCk7XG4gICAgJHNjb3BlLnNlbGVjdCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuc2VsZWN0Tm9kZSgpO1xuICAgIH1cbiAgICAkc2NvcGUuYWR2YW5jZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUuY3VycmVudCA9ICRzY29wZS5xc3RhY2suYWR2YW5jZSgpO1xuICAgIH1cbn0pO1xuIiwiYXBwLmZhY3RvcnkoJ0Z1bGxzdGFja1BpY3MnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CN2dCWHVsQ0FBQVhRY0UuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vZmJjZG4tc3Bob3Rvcy1jLWEuYWthbWFpaGQubmV0L2hwaG90b3MtYWsteGFwMS90MzEuMC04LzEwODYyNDUxXzEwMjA1NjIyOTkwMzU5MjQxXzgwMjcxNjg4NDMzMTI4NDExMzdfby5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItTEtVc2hJZ0FFeTlTSy5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3OS1YN29DTUFBa3c3eS5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItVWo5Q09JSUFJRkFoMC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I2eUl5RmlDRUFBcWwxMi5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NFLVQ3NWxXQUFBbXFxSi5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NFdlpBZy1WQUFBazkzMi5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NFZ05NZU9YSUFJZkRoSy5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NFUXlJRE5XZ0FBdTYwQi5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NDRjNUNVFXOEFFMmxHSi5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NBZVZ3NVNXb0FBQUxzai5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NBYUpJUDdVa0FBbElHcy5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NBUU93OWxXRUFBWTlGbC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItT1FiVnJDTUFBTndJTS5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I5Yl9lcndDWUFBd1JjSi5wbmc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I1UFRkdm5DY0FFQWw0eC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I0cXdDMGlDWUFBbFBHaC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0IyYjMzdlJJVUFBOW8xRC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0J3cEl3cjFJVUFBdk8yXy5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0JzU3NlQU5DWUFFT2hMdy5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NKNHZMZnVVd0FBZGE0TC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NJN3d6akVWRUFBT1BwUy5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NJZEh2VDJVc0FBbm5IVi5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NHQ2lQX1lXWUFBbzc1Vi5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0NJUzRKUElXSUFJMzdxdS5qcGc6bGFyZ2UnXG4gICAgXTtcbn0pO1xuIiwiYXBwLmZhY3RvcnkoJ1JhbmRvbUdyZWV0aW5ncycsIGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBnZXRSYW5kb21Gcm9tQXJyYXkgPSBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgIHJldHVybiBhcnJbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCldO1xuICAgIH07XG5cbiAgICB2YXIgZ3JlZXRpbmdzID0gW1xuICAgICAgICAnSGVsbG8sIHdvcmxkIScsXG4gICAgICAgICdBdCBsb25nIGxhc3QsIEkgbGl2ZSEnLFxuICAgICAgICAnSGVsbG8sIHNpbXBsZSBodW1hbi4nLFxuICAgICAgICAnV2hhdCBhIGJlYXV0aWZ1bCBkYXkhJyxcbiAgICAgICAgJ0lcXCdtIGxpa2UgYW55IG90aGVyIHByb2plY3QsIGV4Y2VwdCB0aGF0IEkgYW0geW91cnMuIDopJyxcbiAgICAgICAgJ1RoaXMgZW1wdHkgc3RyaW5nIGlzIGZvciBMaW5kc2F5IExldmluZS4nLFxuICAgICAgICAn44GT44KT44Gr44Gh44Gv44CB44Om44O844K244O85qeY44CCJyxcbiAgICAgICAgJ1dlbGNvbWUuIFRvLiBXRUJTSVRFLicsXG4gICAgICAgICc6RCcsXG4gICAgICAgICdZZXMsIEkgdGhpbmsgd2VcXCd2ZSBtZXQgYmVmb3JlLicsXG4gICAgICAgICdHaW1tZSAzIG1pbnMuLi4gSSBqdXN0IGdyYWJiZWQgdGhpcyByZWFsbHkgZG9wZSBmcml0dGF0YScsXG4gICAgICAgICdJZiBDb29wZXIgY291bGQgb2ZmZXIgb25seSBvbmUgcGllY2Ugb2YgYWR2aWNlLCBpdCB3b3VsZCBiZSB0byBuZXZTUVVJUlJFTCEnLFxuICAgIF07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBncmVldGluZ3M6IGdyZWV0aW5ncyxcbiAgICAgICAgZ2V0UmFuZG9tR3JlZXRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRSYW5kb21Gcm9tQXJyYXkoZ3JlZXRpbmdzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgnZnVsbHN0YWNrTG9nbycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL2Z1bGxzdGFjay1sb2dvL2Z1bGxzdGFjay1sb2dvLmh0bWwnXG4gICAgfTtcbn0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgnbmF2YmFyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsIEF1dGhTZXJ2aWNlLCBBVVRIX0VWRU5UUywgJHN0YXRlKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZToge30sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdmJhci5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG5cbiAgICAgICAgICAgIHNjb3BlLml0ZW1zID0gW1xuICAgICAgICAgICAgICAgIHsgbGFiZWw6ICdIb21lJywgc3RhdGU6ICdob21lJyB9LFxuICAgICAgICAgICAgICAgIHsgbGFiZWw6ICdBYm91dCcsIHN0YXRlOiAnYWJvdXQnIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ0RvY3VtZW50YXRpb24nLCBzdGF0ZTogJ2RvY3MnIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ01lbWJlcnMgT25seScsIHN0YXRlOiAnbWVtYmVyc09ubHknLCBhdXRoOiB0cnVlIH1cbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIHNjb3BlLnVzZXIgPSBudWxsO1xuXG4gICAgICAgICAgICBzY29wZS5pc0xvZ2dlZEluID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBzZXRVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgcmVtb3ZlVXNlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzY29wZS51c2VyID0gbnVsbDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHNldFVzZXIoKTtcblxuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzLCBzZXRVc2VyKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MsIHJlbW92ZVVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsIHJlbW92ZVVzZXIpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgncmFuZG9HcmVldGluZycsIGZ1bmN0aW9uIChSYW5kb21HcmVldGluZ3MpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvcmFuZG8tZ3JlZXRpbmcvcmFuZG8tZ3JlZXRpbmcuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgICAgICAgc2NvcGUuZ3JlZXRpbmcgPSBSYW5kb21HcmVldGluZ3MuZ2V0UmFuZG9tR3JlZXRpbmcoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
