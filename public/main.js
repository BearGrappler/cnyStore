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
    function QuestionStack(rootNode) {
        var filters = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        this.filters = filters;
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

    /**
     * Puts filter parameters from an object into the 'this.currentFilter' property
     * @param  {[object]} obj [filter parameter(s) taken from QTree node]
     * @return {[undefined]}     [side effect only]
     */
    QuestionStack.prototype.assign = function (obj) {
        var _this2 = this;

        var keys = Object.keys(obj);
        keys.forEach(function (key) {
            if (_this2.currentFilters.hasOwnProperty(key)) {
                _this2.currentFilters[key].push(obj[key]);
            }
        });
    };

    /**
     * This method handles moving down a node in the question tree by wiring QTree/QStack moving parts
     * @return {[QTree]} [The next QTree node to display to the user]
     */
    QuestionStack.prototype.advance = function () {
        var _this3 = this;

        var selected = this.displayed.filter(function (node) {
            return node.selected;
        });
        selected.forEach(function (node) {
            node.selected = false;
            if (node.answers.length) _this3.add(node);
            _this3.assign(node.filters);
        });
        var nextNode = this.stack.length > 0 ? this.stack.pop() : null;
        this.displayed = nextNode ? nextNode.answers : [];
        return nextNode;
    };

    /**
     * Sets the QStack 'stack' property (all the "queued-up" questions)
     * @param {[Object || Array]} obj     [Either a QTree or array of QTrees]
     * @param {Object} filters [A set of filters to apply to the Qstack 'currentFilter' property]
     */
    QuestionStack.prototype.setStack = function (obj) {
        var filters = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        if (Array.isArray(obj)) this.stack = obj;else this.stack = [obj];
        this.displayed = obj.answers;
        this.assign(filters);
    };

    /**
     * Finds a node in the tree by id and sets it as the current node.
     * @param  {[Object]} node [QTree node to start the search]
     * @param  {[Number]} id   [Integer id number corresponding to QTree node]
     * @return {[undefined]}      [just used for side effects]
     */
    QuestionStack.prototype.findNodeById = function (node, id) {
        if (!node) node = this.rootNode;
        if (node.id === id) return this.setStack(node);else node.answers.forEach(function (answer) {
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
        this.start();

        return this;
    };

    /**
     * Starts a new Question Tree process by assigning a new stack, clearing any displaying nodes, etc.
     * @return {[Object]} [Returns a QuestionStack object to facilitate chaining]
     */
    QuestionStack.prototype.start = function () {
        this.displayed.forEach(function (node) {
            node.selected = false;
        });
        this.stack = [];
        this.displayed = [];
        this.currentFilters = Object.assign({}, JSON.parse(JSON.stringify(defaultFilters)), this.filters);
        this.setStack(this.rootNode);
        return this;
    };

    return new QuestionStack(questions.home).initialize();
});

app.factory('QTreeFactory', function () {

    /**
        * Questionnaire Tree (also QTree or Node) Constructor
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

    /**
     * Adds a given question node to the base node (this)'s answer list.
     * @param {[Object]} node [QTree]
     * @returns {[Object]} [Returns original base node to facilitate chaining]
     */
    Questionnaire.prototype.addAnswer = function (node) {
        node.parent = this;
        this.answers.push(node);
        return this;
    };

    /**
     * Adds a given question node as an answer to ALL ANSWER NODES of the base node (this)'s answer list.
     * @param {[Object]} node [QTree]
     * @returns {[Object]} [Returns original base node to facilitate chaining]
     */
    Questionnaire.prototype.chainAnswer = function (node) {
        this.answers.forEach(function (answer) {
            answer.addAnswer(node);
        });
        return this;
    };

    /**
     * Toggles the node's selected property;
     * @return {[type]} [description]
     */
    Questionnaire.prototype.selectNode = function () {
        this.selected = !this.selected;
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

    $scope.qstack = QStackFactory;

    /**
     * Starts a new question process
     * @return {[undefined]} [Side effects only]
     */
    $scope.start = function () {
        $scope.qstack.start();
        $scope.current = $scope.qstack.advance();
        $scope.selected = new Map($scope.qstack.displayed.map(function (node) {
            return [node.id, false];
        }));
    };

    // Starts the question tree for the first time.
    $scope.start();

    /**
     * Toggles the node as selected.
     * @param  {[Object]} node [QTree]
     * @return {[Object]}      [Used for side effects only]
     */
    $scope.select = function (node) {
        $scope.selected.set(node.id, !$scope.selected.get(node.id));
        return node.selectNode();
    };

    /**
     * Wrapper around QStack's advance method. Uses a Map of all selected nodes to prevent erroenous submits
     * @return {[type]} [description]
     */
    $scope.advance = function () {
        if ([].concat(_toConsumableArray($scope.selected.values())).every(function (value) {
            return value === false;
        })) return;
        $scope.current = $scope.qstack.advance();
        $scope.selected.clear();
        $scope.selected = new Map($scope.qstack.displayed.map(function (node) {
            return [node.id, false];
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

app.directive('fullstackLogo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/fullstack-logo/fullstack-logo.html'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiZG9jcy9kb2NzLmpzIiwiZmFjdG9yaWVzL3FzdGFjay5mYWN0b3J5LmpzIiwiZmFjdG9yaWVzL3F0cmVlLmZhY3RvcnkuanMiLCJmc2EvZnNhLXByZS1idWlsdC5qcyIsImhvbWUvaG9tZS5qcyIsImxvZ2luL2xvZ2luLmpzIiwibWVtYmVycy1vbmx5L21lbWJlcnMtb25seS5qcyIsInF1ZXN0aW9ucy9xdWVzdGlvbi5qcyIsImNvbW1vbi9mYWN0b3JpZXMvRnVsbHN0YWNrUGljcy5qcyIsImNvbW1vbi9mYWN0b3JpZXMvUmFuZG9tR3JlZXRpbmdzLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdmJhci5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2Z1bGxzdGFjay1sb2dvL2Z1bGxzdGFjay1sb2dvLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvcmFuZG8tZ3JlZXRpbmcvcmFuZG8tZ3JlZXRpbmcuanMiXSwibmFtZXMiOlsid2luZG93IiwiYXBwIiwiYW5ndWxhciIsIm1vZHVsZSIsImNvbmZpZyIsIiR1cmxSb3V0ZXJQcm92aWRlciIsIiRsb2NhdGlvblByb3ZpZGVyIiwiaHRtbDVNb2RlIiwib3RoZXJ3aXNlIiwid2hlbiIsImxvY2F0aW9uIiwicmVsb2FkIiwicnVuIiwiJHJvb3RTY29wZSIsIkF1dGhTZXJ2aWNlIiwiJHN0YXRlIiwiZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCIsInN0YXRlIiwiZGF0YSIsImF1dGhlbnRpY2F0ZSIsIiRvbiIsImV2ZW50IiwidG9TdGF0ZSIsInRvUGFyYW1zIiwiaXNBdXRoZW50aWNhdGVkIiwicHJldmVudERlZmF1bHQiLCJnZXRMb2dnZWRJblVzZXIiLCJ0aGVuIiwidXNlciIsImdvIiwibmFtZSIsIiRzdGF0ZVByb3ZpZGVyIiwidXJsIiwiY29udHJvbGxlciIsInRlbXBsYXRlVXJsIiwiJHNjb3BlIiwiRnVsbHN0YWNrUGljcyIsImltYWdlcyIsIl8iLCJzaHVmZmxlIiwiZmFjdG9yeSIsIiRodHRwIiwiUVRyZWVGYWN0b3J5IiwiZGVmYXVsdEZpbHRlcnMiLCJjb21wdXRlciIsInR5cGUiLCJwcmljZSIsInByaW9yaXR5IiwicHJvY2Vzc29yIiwicmFtIiwiaGRkIiwiY3B1IiwiZ3B1IiwiUXVlc3Rpb25uYWlyZSIsImJpbmQiLCJxdWVzdGlvbnMiLCJob21lIiwiZGVza3RvcCIsImxhcHRvcCIsImdhbWVyIiwiYXJ0aXN0Iiwic3R1ZGVudCIsImNhc3VhbCIsImdhbWVyR2VucmVSVFMiLCJnYW1lckdlbnJlUlBHIiwiZ2FtZXJHZW5yZUZQUyIsImdhbWVyR2VucmVJTkRJRSIsImFydGlzdEdlbnJlQXVkaW8iLCJhcnRpc3RHZW5yZVZpZGVvIiwiYXJ0aXN0R2VucmVQaG90byIsInN0dWRlbnRNYWpvclNURU0iLCJzdHVkZW50TWFqb3JUcmFkZSIsInN0dWRlbnRNYWpvckxpYkFydHMiLCJzdHVkZW50TWFqb3JTcG9ydHMiLCJzcGVlZCIsImdyYXBoaWNzIiwic3BhY2UiLCJyb3VuZGVkIiwiUXVlc3Rpb25TdGFjayIsInJvb3ROb2RlIiwiZmlsdGVycyIsInByb3RvdHlwZSIsImFkZCIsIm5vZGVzIiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsInN0YWNrIiwicHVzaCIsIm5vZGUiLCJhc3NpZ24iLCJvYmoiLCJrZXlzIiwiT2JqZWN0IiwiY3VycmVudEZpbHRlcnMiLCJoYXNPd25Qcm9wZXJ0eSIsImtleSIsImFkdmFuY2UiLCJzZWxlY3RlZCIsImRpc3BsYXllZCIsImZpbHRlciIsImFuc3dlcnMiLCJsZW5ndGgiLCJuZXh0Tm9kZSIsInBvcCIsInNldFN0YWNrIiwiZmluZE5vZGVCeUlkIiwiaWQiLCJhbnN3ZXIiLCJpbml0aWFsaXplIiwiYWRkQW5zd2VyIiwiY2hhaW5BbnN3ZXIiLCJzdGFydCIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImxhYmVsIiwicXVlc3Rpb24iLCJmaWx0ZXJzT2JqIiwicGFyZW50Iiwic2VsZWN0Tm9kZSIsIkVycm9yIiwiaW8iLCJvcmlnaW4iLCJjb25zdGFudCIsImxvZ2luU3VjY2VzcyIsImxvZ2luRmFpbGVkIiwibG9nb3V0U3VjY2VzcyIsInNlc3Npb25UaW1lb3V0Iiwibm90QXV0aGVudGljYXRlZCIsIm5vdEF1dGhvcml6ZWQiLCIkcSIsIkFVVEhfRVZFTlRTIiwic3RhdHVzRGljdCIsInJlc3BvbnNlRXJyb3IiLCJyZXNwb25zZSIsIiRicm9hZGNhc3QiLCJzdGF0dXMiLCJyZWplY3QiLCIkaHR0cFByb3ZpZGVyIiwiaW50ZXJjZXB0b3JzIiwiJGluamVjdG9yIiwiZ2V0Iiwic2VydmljZSIsIlNlc3Npb24iLCJvblN1Y2Nlc3NmdWxMb2dpbiIsImNyZWF0ZSIsImZyb21TZXJ2ZXIiLCJjYXRjaCIsImxvZ2luIiwiY3JlZGVudGlhbHMiLCJwb3N0IiwibWVzc2FnZSIsImxvZ291dCIsImRlc3Ryb3kiLCJzZWxmIiwic2Vzc2lvbklkIiwiZXJyb3IiLCJzZW5kTG9naW4iLCJsb2dpbkluZm8iLCJ0ZW1wbGF0ZSIsIlNlY3JldFN0YXNoIiwiZ2V0U3Rhc2giLCJzdGFzaCIsIlFTdGFja0ZhY3RvcnkiLCJxc3RhY2siLCJjdXJyZW50IiwiTWFwIiwibWFwIiwic2VsZWN0Iiwic2V0IiwidmFsdWVzIiwiZXZlcnkiLCJ2YWx1ZSIsImNsZWFyIiwiZ2V0UmFuZG9tRnJvbUFycmF5IiwiYXJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZ3JlZXRpbmdzIiwiZ2V0UmFuZG9tR3JlZXRpbmciLCJkaXJlY3RpdmUiLCJyZXN0cmljdCIsInNjb3BlIiwibGluayIsIml0ZW1zIiwiYXV0aCIsImlzTG9nZ2VkSW4iLCJzZXRVc2VyIiwicmVtb3ZlVXNlciIsIlJhbmRvbUdyZWV0aW5ncyIsImdyZWV0aW5nIl0sIm1hcHBpbmdzIjoiQUFBQTs7OztBQUNBQSxPQUFBQyxHQUFBLEdBQUFDLFFBQUFDLE1BQUEsQ0FBQSx1QkFBQSxFQUFBLENBQUEsYUFBQSxFQUFBLFdBQUEsRUFBQSxjQUFBLEVBQUEsV0FB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LElBQUFxTCxTQUFBLENBQUEsZUFBQSxFQUFBLFVBQUFTLGVBQUEsRUFBQTs7QUFFQSxXQUFBO0FBQ0FSLGtCQUFBLEdBREE7QUFFQXJKLHFCQUFBLHlEQUZBO0FBR0F1SixjQUFBLGNBQUFELEtBQUEsRUFBQTtBQUNBQSxrQkFBQVEsUUFBQSxHQUFBRCxnQkFBQVYsaUJBQUEsRUFBQTtBQUNBO0FBTEEsS0FBQTtBQVFBLENBVkEiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbndpbmRvdy5hcHAgPSBhbmd1bGFyLm1vZHVsZSgnRnVsbHN0YWNrR2VuZXJhdGVkQXBwJywgWydmc2FQcmVCdWlsdCcsICd1aS5yb3V0ZXInLCAndWkuYm9vdHN0cmFwJywgJ25nQW5pbWF0ZSddKTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgLy8gSWYgd2UgZ28gdG8gYSBVUkwgdGhhdCB1aS1yb3V0ZXIgZG9lc24ndCBoYXZlIHJlZ2lzdGVyZWQsIGdvIHRvIHRoZSBcIi9cIiB1cmwuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuICAgIC8vIFRyaWdnZXIgcGFnZSByZWZyZXNoIHdoZW4gYWNjZXNzaW5nIGFuIE9BdXRoIHJvdXRlXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJy9hdXRoLzpwcm92aWRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xufSk7XG5cbi8vIFRoaXMgYXBwLnJ1biBpcyBmb3IgY29udHJvbGxpbmcgYWNjZXNzIHRvIHNwZWNpZmljIHN0YXRlcy5cbmFwcC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsIEF1dGhTZXJ2aWNlLCAkc3RhdGUpIHtcblxuICAgIC8vIFRoZSBnaXZlbiBzdGF0ZSByZXF1aXJlcyBhbiBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAgdmFyIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGggPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLmRhdGEgJiYgc3RhdGUuZGF0YS5hdXRoZW50aWNhdGU7XG4gICAgfTtcblxuICAgIC8vICRzdGF0ZUNoYW5nZVN0YXJ0IGlzIGFuIGV2ZW50IGZpcmVkXG4gICAgLy8gd2hlbmV2ZXIgdGhlIHByb2Nlc3Mgb2YgY2hhbmdpbmcgYSBzdGF0ZSBiZWdpbnMuXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcykge1xuXG4gICAgICAgIGlmICghZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCh0b1N0YXRlKSkge1xuICAgICAgICAgICAgLy8gVGhlIGRlc3RpbmF0aW9uIHN0YXRlIGRvZXMgbm90IHJlcXVpcmUgYXV0aGVudGljYXRpb25cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgIC8vIFRoZSB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQuXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2FuY2VsIG5hdmlnYXRpbmcgdG8gbmV3IHN0YXRlLlxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgIC8vIElmIGEgdXNlciBpcyByZXRyaWV2ZWQsIHRoZW4gcmVuYXZpZ2F0ZSB0byB0aGUgZGVzdGluYXRpb25cbiAgICAgICAgICAgIC8vICh0aGUgc2Vjb25kIHRpbWUsIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpIHdpbGwgd29yaylcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSwgaWYgbm8gdXNlciBpcyBsb2dnZWQgaW4sIGdvIHRvIFwibG9naW5cIiBzdGF0ZS5cbiAgICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKHRvU3RhdGUubmFtZSwgdG9QYXJhbXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqYWJvdXQqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhYm91dCcsIHtcbiAgICAgICAgdXJsOiAnL2Fib3V0JyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWJvdXQvYWJvdXQuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBYm91dENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBGdWxsc3RhY2tQaWNzKSB7XG5cbiAgICAvLyBJbWFnZXMgb2YgYmVhdXRpZnVsIEZ1bGxzdGFjayBwZW9wbGUuXG4gICAgJHNjb3BlLmltYWdlcyA9IF8uc2h1ZmZsZShGdWxsc3RhY2tQaWNzKTtcblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdkb2NzJywge1xuICAgICAgICB1cmw6ICcvZG9jcycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvZG9jcy9kb2NzLmh0bWwnXG4gICAgfSk7XG59KTtcbiIsImFwcC5mYWN0b3J5KCdRU3RhY2tGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHAsIFFUcmVlRmFjdG9yeSkge1xuXG4gICAgbGV0IGRlZmF1bHRGaWx0ZXJzID0ge1xuICAgICAgICBjb21wdXRlcjogW10sXG4gICAgICAgIHR5cGU6IFtdLFxuICAgICAgICBwcmljZTogW10sXG4gICAgICAgIHByaW9yaXR5OiBbXSxcbiAgICAgICAgcHJvY2Vzc29yOiBbXSxcbiAgICAgICAgcmFtOiBbXSxcbiAgICAgICAgaGRkOiBbXSxcbiAgICAgICAgY3B1OiBbXSxcbiAgICAgICAgZ3B1OiBbXVxuICAgIH07XG5cbiAgICBsZXQgUXVlc3Rpb25uYWlyZSA9IFFUcmVlRmFjdG9yeS5iaW5kKFFUcmVlRmFjdG9yeSk7XG5cbiAgICAvLyBQcm9iYWJseSBzaG91bGQgbW92ZSB0byBhIGRhdGFiYXNlIGF0IHNvbWUgcG9pbnQgaW4gdGhlIGZ1dHVyZSB0aW1lbGluZS4uLlxuICAgIGxldCBxdWVzdGlvbnMgPSB7XG4gICAgICAgIGhvbWU6IG5ldyBRdWVzdGlvbm5haXJlKDAsICdIb21lJywgJ1doaWNoIHR5cGUgb2YgY29tcHV0ZXIgYXJlIHlvdSBsb29raW5nIGZvcj8nLCB7fSksXG4gICAgICAgIGRlc2t0b3A6IG5ldyBRdWVzdGlvbm5haXJlKDEsICdEZXNrdG9wJywgJ1doaWNoIHR5cGUgb2YgdXNlciBhcmUgeW91PycsIHsgY29tcHV0ZXI6ICdkZXNrdG9wJyB9KSxcbiAgICAgICAgbGFwdG9wOiBuZXcgUXVlc3Rpb25uYWlyZSgyLCAnTGFwdG9wJywgJ1doaWNoIHR5cGUgb2YgdXNlciBhcmUgeW91PycsIHsgY29tcHV0ZXI6ICdsYXB0b3AnIH0pLFxuICAgICAgICBnYW1lcjogbmV3IFF1ZXN0aW9ubmFpcmUoMywgJ0dhbWVyJywgJ1NlbGVjdCB5b3VyIGZhdm9yaXRlIGdlbnJlcycsIHsgdHlwZTogJ2dhbWVyJyB9KSxcbiAgICAgICAgYXJ0aXN0OiBuZXcgUXVlc3Rpb25uYWlyZSg0LCAnQXJ0aXN0JywgJ0RvIHlvdSB3b3JrIHdpdGggYXVkaW8/IFZpZGVvPyBNb3JlIGNyZWF0aXZlIG1lZGlhPycsIHsgdHlwZTogJ2FydGlzdCcgfSksXG4gICAgICAgIHN0dWRlbnQ6IG5ldyBRdWVzdGlvbm5haXJlKDUsICdTdHVkZW50JywgJ1doYXQgYXJlIHlvdSBzdHVkeWluZz8nLCB7IHR5cGU6ICdzdHVkZW50JyB9KSxcbiAgICAgICAgY2FzdWFsOiBuZXcgUXVlc3Rpb25uYWlyZSg2LCAnQ2FzdWFsJywgXCJXaGF0J3MgaW1wb3J0YW50IHRvIHlvdT9cIiwgeyB0eXBlOiAnY2FzdWFsJyB9KSxcblxuICAgICAgICBnYW1lckdlbnJlUlRTOiBuZXcgUXVlc3Rpb25uYWlyZSg3LCAnU3RyYXRlZ3knLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IGNwdTogJzQnLCByYW06ICc0JywgZ3B1OiAnMicgfSksXG4gICAgICAgIGdhbWVyR2VucmVSUEc6IG5ldyBRdWVzdGlvbm5haXJlKDgsICdSb2xlIFBsYXlpbmcgR2FtZXMnLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IGNwdTogJzQnLCByYW06ICczJywgZ3B1OiAnNCcgfSksXG4gICAgICAgIGdhbWVyR2VucmVGUFM6IG5ldyBRdWVzdGlvbm5haXJlKDksICdGUFMvQWN0aW9uJywgXCJXaGF0J3MgaW1wb3J0YW50IHRvIHlvdT9cIiwgeyBjcHU6ICc0JywgcmFtOiAnMycsIGdwdTogJzQnIH0pLFxuICAgICAgICBnYW1lckdlbnJlSU5ESUU6IG5ldyBRdWVzdGlvbm5haXJlKDEwLCAnSW5kaWUnLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IGNwdTogJzInLCByYW06ICcyJywgZ3B1OiAnMicgfSksXG5cbiAgICAgICAgYXJ0aXN0R2VucmVBdWRpbzogbmV3IFF1ZXN0aW9ubmFpcmUoMTEsICdBdWRpbycsIFwiV2hhdCdzIGltcG9ydGFudCB0byB5b3U/XCIsIHsgY3B1OiAnNCcsIHJhbTogJzMnLCBncHU6ICcwJyB9KSxcbiAgICAgICAgYXJ0aXN0R2VucmVWaWRlbzogbmV3IFF1ZXN0aW9ubmFpcmUoMTIsICdWaWRlbycsIFwiV2hhdCdzIGltcG9ydGFudCB0byB5b3U/XCIsIHsgY3B1OiAnNCcsIHJhbTogJzMnLCBncHU6ICcxJyB9KSxcbiAgICAgICAgYXJ0aXN0R2VucmVQaG90bzogbmV3IFF1ZXN0aW9ubmFpcmUoMTMsICdQaG90bycsIFwiV2hhdCdzIGltcG9ydGFudCB0byB5b3U/XCIsIHsgY3B1OiAnMycsIHJhbTogJzInLCBncHU6ICcwJyB9KSxcblxuICAgICAgICBzdHVkZW50TWFqb3JTVEVNOiBuZXcgUXVlc3Rpb25uYWlyZSgxNCwgJ1NjaWVuY2UvVGVjaG5vbG9neS9NYXRoJywgXCJXaGF0J3MgaW1wb3J0YW50IHRvIHlvdT9cIiwgeyBjcHU6ICczJywgcmFtOiAnMicsIGdwdTogJzEnIH0pLFxuICAgICAgICBzdHVkZW50TWFqb3JUcmFkZTogbmV3IFF1ZXN0aW9ubmFpcmUoMTUsICdUcmFkZSBTY2hvb2wnLCBcIldoYXQncyBpbXBvcnRhbnQgdG8geW91P1wiLCB7IGNwdTogJzEnLCByYW06ICcxJywgZ3B1OiAnMCcgfSksXG4gICAgICAgIHN0dWRlbnRNYWpvckxpYkFydHM6IG5ldyBRdWVzdGlvbm5haXJlKDE2LCAnTGliZXJhbCBBcnRzJywgXCJXaGF0J3MgaW1wb3J0YW50IHRvIHlvdT9cIiwgeyBjcHU6ICcyJywgcmFtOiAnMicsIGdwdTogJzAnIH0pLFxuICAgICAgICBzdHVkZW50TWFqb3JTcG9ydHM6IG5ldyBRdWVzdGlvbm5haXJlKDE3LCAnU3BvcnRzJywgXCJXaGF0J3MgaW1wb3J0YW50IHRvIHlvdT9cIiwgeyBjcHU6ICcxJywgcmFtOiAnMicsIGdwdTogJzAnIH0pLFxuXG4gICAgICAgIHByaWNlOiBuZXcgUXVlc3Rpb25uYWlyZSgxOCwgJ1ByaWNlJywgJycsIHsgcHJpY2U6ICcxJyB9KSxcbiAgICAgICAgc3BlZWQ6IG5ldyBRdWVzdGlvbm5haXJlKDE5LCAnU3BlZWQnLCAnJywgeyBjcHU6ICczJywgcmFtOiAnMicsIGdwdTogJzAnLCBoZGQ6ICc0JywgcHJpY2U6ICc1JyB9KSxcbiAgICAgICAgZ3JhcGhpY3M6IG5ldyBRdWVzdGlvbm5haXJlKDIwLCAnR3JhcGhpY3MnLCAnJywgeyBncHU6ICc1JywgcHJpY2U6ICc0JyB9KSxcbiAgICAgICAgc3BhY2U6IG5ldyBRdWVzdGlvbm5haXJlKDIxLCAnU3BhY2UnLCAnJywgeyBoZGQ6ICc1JywgcHJpY2U6ICczJyB9KSxcbiAgICAgICAgcm91bmRlZDogbmV3IFF1ZXN0aW9ubmFpcmUoMjIsICdXZWxsLVJvdW5kZWQnLCAnJywgeyBjcHU6ICcyJywgcmFtOiAnMicsIGdwdTogJzInLCBoZGQ6ICcyJywgcHJpY2U6ICcyJyB9KSxcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUXVlc3Rpb25TdGFjayBTdGFjayBDb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7W1F1ZXN0aW9ubmFpcmVdfSByb290Tm9kZSBbVGhlIHJvb3Qgbm9kZSBvZiB0aGUgcXVlc3Rpb24gdHJlZSAoc2hvdWxkIGJlICdob21lJyBub2RlIC0gSUQ6IDEpXVxuICAgICAqIEBwYXJhbSB7W09iamVjdF19ICAgICAgICBmaWx0ZXJzICBbRmlsdGVycyB0byBsb2FkIC0gY2FuIHJldHJpZXZlIGZpbHRlcnMgZnJvbSBDYXJ0IGVudHJ5IGluIERCXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFF1ZXN0aW9uU3RhY2socm9vdE5vZGUsIGZpbHRlcnMgPSB7fSkge1xuICAgICAgICB0aGlzLmZpbHRlcnMgPSBmaWx0ZXJzO1xuICAgICAgICB0aGlzLnJvb3ROb2RlID0gcm9vdE5vZGU7XG4gICAgfVxuXG4gICAgUXVlc3Rpb25TdGFjay5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24obm9kZXMpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobm9kZXMpKSB7XG4gICAgICAgICAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4gdGhpcy5zdGFjay5wdXNoKG5vZGUpKTtcbiAgICAgICAgfSBlbHNlIHsgdGhpcy5zdGFjay5wdXNoKG5vZGVzKTsgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFB1dHMgZmlsdGVyIHBhcmFtZXRlcnMgZnJvbSBhbiBvYmplY3QgaW50byB0aGUgJ3RoaXMuY3VycmVudEZpbHRlcicgcHJvcGVydHlcbiAgICAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gb2JqIFtmaWx0ZXIgcGFyYW1ldGVyKHMpIHRha2VuIGZyb20gUVRyZWUgbm9kZV1cbiAgICAgKiBAcmV0dXJuIHtbdW5kZWZpbmVkXX0gICAgIFtzaWRlIGVmZmVjdCBvbmx5XVxuICAgICAqL1xuICAgIFF1ZXN0aW9uU3RhY2sucHJvdG90eXBlLmFzc2lnbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgICAgIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEZpbHRlcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEZpbHRlcnNba2V5XS5wdXNoKG9ialtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIG1ldGhvZCBoYW5kbGVzIG1vdmluZyBkb3duIGEgbm9kZSBpbiB0aGUgcXVlc3Rpb24gdHJlZSBieSB3aXJpbmcgUVRyZWUvUVN0YWNrIG1vdmluZyBwYXJ0c1xuICAgICAqIEByZXR1cm4ge1tRVHJlZV19IFtUaGUgbmV4dCBRVHJlZSBub2RlIHRvIGRpc3BsYXkgdG8gdGhlIHVzZXJdXG4gICAgICovXG4gICAgUXVlc3Rpb25TdGFjay5wcm90b3R5cGUuYWR2YW5jZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzLmRpc3BsYXllZC5maWx0ZXIobm9kZSA9PiBub2RlLnNlbGVjdGVkKTtcbiAgICAgICAgc2VsZWN0ZWQuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgIG5vZGUuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChub2RlLmFuc3dlcnMubGVuZ3RoKSB0aGlzLmFkZChub2RlKTtcbiAgICAgICAgICAgIHRoaXMuYXNzaWduKG5vZGUuZmlsdGVycyk7XG4gICAgICAgIH0pXG4gICAgICAgIGxldCBuZXh0Tm9kZSA9IHRoaXMuc3RhY2subGVuZ3RoID4gMCA/IHRoaXMuc3RhY2sucG9wKCkgOiBudWxsO1xuICAgICAgICB0aGlzLmRpc3BsYXllZCA9IG5leHROb2RlID8gbmV4dE5vZGUuYW5zd2VycyA6IFtdO1xuICAgICAgICByZXR1cm4gbmV4dE5vZGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgUVN0YWNrICdzdGFjaycgcHJvcGVydHkgKGFsbCB0aGUgXCJxdWV1ZWQtdXBcIiBxdWVzdGlvbnMpXG4gICAgICogQHBhcmFtIHtbT2JqZWN0IHx8IEFycmF5XX0gb2JqICAgICBbRWl0aGVyIGEgUVRyZWUgb3IgYXJyYXkgb2YgUVRyZWVzXVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBmaWx0ZXJzIFtBIHNldCBvZiBmaWx0ZXJzIHRvIGFwcGx5IHRvIHRoZSBRc3RhY2sgJ2N1cnJlbnRGaWx0ZXInIHByb3BlcnR5XVxuICAgICAqL1xuICAgIFF1ZXN0aW9uU3RhY2sucHJvdG90eXBlLnNldFN0YWNrID0gZnVuY3Rpb24ob2JqLCBmaWx0ZXJzID0ge30pIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkgdGhpcy5zdGFjayA9IG9iajtcbiAgICAgICAgZWxzZSB0aGlzLnN0YWNrID0gW29ial07XG4gICAgICAgIHRoaXMuZGlzcGxheWVkID0gb2JqLmFuc3dlcnM7XG4gICAgICAgIHRoaXMuYXNzaWduKGZpbHRlcnMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmRzIGEgbm9kZSBpbiB0aGUgdHJlZSBieSBpZCBhbmQgc2V0cyBpdCBhcyB0aGUgY3VycmVudCBub2RlLlxuICAgICAqIEBwYXJhbSAge1tPYmplY3RdfSBub2RlIFtRVHJlZSBub2RlIHRvIHN0YXJ0IHRoZSBzZWFyY2hdXG4gICAgICogQHBhcmFtICB7W051bWJlcl19IGlkICAgW0ludGVnZXIgaWQgbnVtYmVyIGNvcnJlc3BvbmRpbmcgdG8gUVRyZWUgbm9kZV1cbiAgICAgKiBAcmV0dXJuIHtbdW5kZWZpbmVkXX0gICAgICBbanVzdCB1c2VkIGZvciBzaWRlIGVmZmVjdHNdXG4gICAgICovXG4gICAgUXVlc3Rpb25TdGFjay5wcm90b3R5cGUuZmluZE5vZGVCeUlkID0gZnVuY3Rpb24obm9kZSwgaWQpIHtcbiAgICAgICAgaWYgKCFub2RlKSBub2RlID0gdGhpcy5yb290Tm9kZTtcbiAgICAgICAgaWYgKG5vZGUuaWQgPT09IGlkKSByZXR1cm4gdGhpcy5zZXRTdGFjayhub2RlKTtcbiAgICAgICAgZWxzZSBub2RlLmFuc3dlcnMuZm9yRWFjaChhbnN3ZXIgPT4gUXVlc3Rpb25uYWlyZS5maW5kTm9kZUJ5SWQoYW5zd2VyLCBpZCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHRyZWUgc3RydWN0dXJlL2Fzc29jaWF0aW9ucyBmb3IgcXVlc3Rpb25uYWlyZS5cbiAgICAgKiBAcmV0dXJuIHtbdW5kZWZpbmVkXX0gW05vdGhpbmcgcmV0dXJuZWRdXG4gICAgICovXG4gICAgUXVlc3Rpb25TdGFjay5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBxdWVzdGlvbnMuaG9tZS5hZGRBbnN3ZXIocXVlc3Rpb25zLmRlc2t0b3ApO1xuICAgICAgICBxdWVzdGlvbnMuaG9tZS5hZGRBbnN3ZXIocXVlc3Rpb25zLmxhcHRvcCk7XG5cbiAgICAgICAgcXVlc3Rpb25zLmRlc2t0b3BcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmdhbWVyKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuYXJ0aXN0KVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuc3R1ZGVudClcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmNhc3VhbCk7XG5cbiAgICAgICAgcXVlc3Rpb25zLmxhcHRvcFxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuZ2FtZXIpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5hcnRpc3QpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5zdHVkZW50KVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuY2FzdWFsKTtcblxuICAgICAgICBxdWVzdGlvbnMuZ2FtZXJcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmdhbWVyR2VucmVSVFMpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5nYW1lckdlbnJlSU5ESUUpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5nYW1lckdlbnJlRlBTKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuZ2FtZXJHZW5yZVJQRyk7XG5cbiAgICAgICAgcXVlc3Rpb25zLmdhbWVyXG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLnByaWNlKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5zcGVlZClcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMuZ3JhcGhpY3MpXG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLnNwYWNlKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5yb3VuZGVkKTtcblxuICAgICAgICBxdWVzdGlvbnMuYXJ0aXN0XG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5hcnRpc3RHZW5yZVBob3RvKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuYXJ0aXN0R2VucmVBdWRpbylcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLmFydGlzdEdlbnJlVmlkZW8pO1xuXG4gICAgICAgIHF1ZXN0aW9ucy5hcnRpc3RcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMucHJpY2UpXG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLnNwZWVkKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5ncmFwaGljcylcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMuc3BhY2UpXG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLnJvdW5kZWQpO1xuXG4gICAgICAgIHF1ZXN0aW9ucy5zdHVkZW50XG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5zdHVkZW50TWFqb3JTVEVNKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuc3R1ZGVudE1ham9yVHJhZGUpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5zdHVkZW50TWFqb3JTcG9ydHMpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5zdHVkZW50TWFqb3JMaWJBcnRzKTtcbiAgICAgICAgcXVlc3Rpb25zLnN0dWRlbnRcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMucHJpY2UpXG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLnNwZWVkKVxuICAgICAgICAgICAgLmNoYWluQW5zd2VyKHF1ZXN0aW9ucy5ncmFwaGljcylcbiAgICAgICAgICAgIC5jaGFpbkFuc3dlcihxdWVzdGlvbnMuc3BhY2UpXG4gICAgICAgICAgICAuY2hhaW5BbnN3ZXIocXVlc3Rpb25zLnJvdW5kZWQpO1xuXG4gICAgICAgIHF1ZXN0aW9ucy5jYXN1YWxcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLnByaWNlKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMuc3BlZWQpXG4gICAgICAgICAgICAuYWRkQW5zd2VyKHF1ZXN0aW9ucy5ncmFwaGljcylcbiAgICAgICAgICAgIC5hZGRBbnN3ZXIocXVlc3Rpb25zLnNwYWNlKVxuICAgICAgICAgICAgLmFkZEFuc3dlcihxdWVzdGlvbnMucm91bmRlZCk7XG5cblxuICAgICAgICB0aGlzLnNldFN0YWNrKHRoaXMucm9vdE5vZGUpO1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhcnRzIGEgbmV3IFF1ZXN0aW9uIFRyZWUgcHJvY2VzcyBieSBhc3NpZ25pbmcgYSBuZXcgc3RhY2ssIGNsZWFyaW5nIGFueSBkaXNwbGF5aW5nIG5vZGVzLCBldGMuXG4gICAgICogQHJldHVybiB7W09iamVjdF19IFtSZXR1cm5zIGEgUXVlc3Rpb25TdGFjayBvYmplY3QgdG8gZmFjaWxpdGF0ZSBjaGFpbmluZ11cbiAgICAgKi9cbiAgICBRdWVzdGlvblN0YWNrLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmRpc3BsYXllZC5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgbm9kZS5zZWxlY3RlZCA9IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuc3RhY2sgPSBbXTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWQgPSBbXTtcbiAgICAgICAgdGhpcy5jdXJyZW50RmlsdGVycyA9IE9iamVjdC5hc3NpZ24oe30sIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGVmYXVsdEZpbHRlcnMpKSwgdGhpcy5maWx0ZXJzKTtcbiAgICAgICAgdGhpcy5zZXRTdGFjayh0aGlzLnJvb3ROb2RlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBRdWVzdGlvblN0YWNrKHF1ZXN0aW9ucy5ob21lKS5pbml0aWFsaXplKCk7XG5cbn0pO1xuIiwiYXBwLmZhY3RvcnkoJ1FUcmVlRmFjdG9yeScsIGZ1bmN0aW9uKCkge1xuXG5cdC8qKlxuICAgICAqIFF1ZXN0aW9ubmFpcmUgVHJlZSAoYWxzbyBRVHJlZSBvciBOb2RlKSBDb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7W051bWJlcl19IGlkICAgICAgICAgW0ludGVnZXIga2V5IGZvciB0aGUgbm9kZSAoZW5hYmxlcyBsb29rdXApXVxuICAgICAqIEBwYXJhbSB7W1N0cmluZ119IGxhYmVsICAgICAgW0Rlc2NyaXB0b3IgdG8gZGlzcGxheSBvbiBzZWxlY3RvciBlbGVtZW50XVxuICAgICAqIEBwYXJhbSB7W1N0cmluZ119IHF1ZXN0aW9uICAgW1F1ZXN0aW9uIHRvIGRpc3BsYXkgdG8gdXNlciAoYW5zd2VyIHNlbGVjdG9ycyBhcmUgaW4gdGhpcy5hbnN3ZXJzKV1cbiAgICAgKiBAcGFyYW0ge1tPYmplY3RdfSBmaWx0ZXJzT2JqIFtGaWx0ZXJzIHRvIGFwcGx5IGJhc2VkIG9uIGFuc3dlciBjaG9pY2VdXG4gICAgICovXG4gICAgZnVuY3Rpb24gUXVlc3Rpb25uYWlyZShpZCwgbGFiZWwsIHF1ZXN0aW9uLCBmaWx0ZXJzT2JqKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHF1ZXN0aW9uO1xuICAgICAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgICAgIHRoaXMuZmlsdGVycyA9IGZpbHRlcnNPYmpcbiAgICAgICAgdGhpcy5hbnN3ZXJzID0gW107XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBnaXZlbiBxdWVzdGlvbiBub2RlIHRvIHRoZSBiYXNlIG5vZGUgKHRoaXMpJ3MgYW5zd2VyIGxpc3QuXG4gICAgICogQHBhcmFtIHtbT2JqZWN0XX0gbm9kZSBbUVRyZWVdXG4gICAgICogQHJldHVybnMge1tPYmplY3RdfSBbUmV0dXJucyBvcmlnaW5hbCBiYXNlIG5vZGUgdG8gZmFjaWxpdGF0ZSBjaGFpbmluZ11cbiAgICAgKi9cbiAgICBRdWVzdGlvbm5haXJlLnByb3RvdHlwZS5hZGRBbnN3ZXIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIG5vZGUucGFyZW50ID0gdGhpcztcbiAgICAgICAgdGhpcy5hbnN3ZXJzLnB1c2gobm9kZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIGdpdmVuIHF1ZXN0aW9uIG5vZGUgYXMgYW4gYW5zd2VyIHRvIEFMTCBBTlNXRVIgTk9ERVMgb2YgdGhlIGJhc2Ugbm9kZSAodGhpcykncyBhbnN3ZXIgbGlzdC5cbiAgICAgKiBAcGFyYW0ge1tPYmplY3RdfSBub2RlIFtRVHJlZV1cbiAgICAgKiBAcmV0dXJucyB7W09iamVjdF19IFtSZXR1cm5zIG9yaWdpbmFsIGJhc2Ugbm9kZSB0byBmYWNpbGl0YXRlIGNoYWluaW5nXVxuICAgICAqL1xuICAgIFF1ZXN0aW9ubmFpcmUucHJvdG90eXBlLmNoYWluQW5zd2VyID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICB0aGlzLmFuc3dlcnMuZm9yRWFjaChhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgYW5zd2VyLmFkZEFuc3dlcihub2RlKVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlcyB0aGUgbm9kZSdzIHNlbGVjdGVkIHByb3BlcnR5O1xuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICAgIFF1ZXN0aW9ubmFpcmUucHJvdG90eXBlLnNlbGVjdE5vZGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9ICF0aGlzLnNlbGVjdGVkO1xuICAgIH1cblxuICAgIHJldHVybiBRdWVzdGlvbm5haXJlO1xuXG59KTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBIb3BlIHlvdSBkaWRuJ3QgZm9yZ2V0IEFuZ3VsYXIhIER1aC1kb3kuXG4gICAgaWYgKCF3aW5kb3cuYW5ndWxhcikgdGhyb3cgbmV3IEVycm9yKCdJIGNhblxcJ3QgZmluZCBBbmd1bGFyIScpO1xuXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdmc2FQcmVCdWlsdCcsIFtdKTtcblxuICAgIGFwcC5mYWN0b3J5KCdTb2NrZXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghd2luZG93LmlvKSB0aHJvdyBuZXcgRXJyb3IoJ3NvY2tldC5pbyBub3QgZm91bmQhJyk7XG4gICAgICAgIHJldHVybiB3aW5kb3cuaW8od2luZG93LmxvY2F0aW9uLm9yaWdpbik7XG4gICAgfSk7XG5cbiAgICAvLyBBVVRIX0VWRU5UUyBpcyB1c2VkIHRocm91Z2hvdXQgb3VyIGFwcCB0b1xuICAgIC8vIGJyb2FkY2FzdCBhbmQgbGlzdGVuIGZyb20gYW5kIHRvIHRoZSAkcm9vdFNjb3BlXG4gICAgLy8gZm9yIGltcG9ydGFudCBldmVudHMgYWJvdXQgYXV0aGVudGljYXRpb24gZmxvdy5cbiAgICBhcHAuY29uc3RhbnQoJ0FVVEhfRVZFTlRTJywge1xuICAgICAgICBsb2dpblN1Y2Nlc3M6ICdhdXRoLWxvZ2luLXN1Y2Nlc3MnLFxuICAgICAgICBsb2dpbkZhaWxlZDogJ2F1dGgtbG9naW4tZmFpbGVkJyxcbiAgICAgICAgbG9nb3V0U3VjY2VzczogJ2F1dGgtbG9nb3V0LXN1Y2Nlc3MnLFxuICAgICAgICBzZXNzaW9uVGltZW91dDogJ2F1dGgtc2Vzc2lvbi10aW1lb3V0JyxcbiAgICAgICAgbm90QXV0aGVudGljYXRlZDogJ2F1dGgtbm90LWF1dGhlbnRpY2F0ZWQnLFxuICAgICAgICBub3RBdXRob3JpemVkOiAnYXV0aC1ub3QtYXV0aG9yaXplZCdcbiAgICB9KTtcblxuICAgIGFwcC5mYWN0b3J5KCdBdXRoSW50ZXJjZXB0b3InLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHEsIEFVVEhfRVZFTlRTKSB7XG4gICAgICAgIHZhciBzdGF0dXNEaWN0ID0ge1xuICAgICAgICAgICAgNDAxOiBBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLFxuICAgICAgICAgICAgNDAzOiBBVVRIX0VWRU5UUy5ub3RBdXRob3JpemVkLFxuICAgICAgICAgICAgNDE5OiBBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCxcbiAgICAgICAgICAgIDQ0MDogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXRcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChzdGF0dXNEaWN0W3Jlc3BvbnNlLnN0YXR1c10sIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgYXBwLmNvbmZpZyhmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFtcbiAgICAgICAgICAgICckaW5qZWN0b3InLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZSgnQXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsIFNlc3Npb24sICRyb290U2NvcGUsIEFVVEhfRVZFTlRTLCAkcSkge1xuXG4gICAgICAgIGZ1bmN0aW9uIG9uU3VjY2Vzc2Z1bExvZ2luKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB2YXIgdXNlciA9IHJlc3BvbnNlLmRhdGEudXNlcjtcbiAgICAgICAgICAgIFNlc3Npb24uY3JlYXRlKHVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ2luU3VjY2Vzcyk7XG4gICAgICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVzZXMgdGhlIHNlc3Npb24gZmFjdG9yeSB0byBzZWUgaWYgYW5cbiAgICAgICAgLy8gYXV0aGVudGljYXRlZCB1c2VyIGlzIGN1cnJlbnRseSByZWdpc3RlcmVkLlxuICAgICAgICB0aGlzLmlzQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAhIVNlc3Npb24udXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdldExvZ2dlZEluVXNlciA9IGZ1bmN0aW9uIChmcm9tU2VydmVyKSB7XG5cbiAgICAgICAgICAgIC8vIElmIGFuIGF1dGhlbnRpY2F0ZWQgc2Vzc2lvbiBleGlzdHMsIHdlXG4gICAgICAgICAgICAvLyByZXR1cm4gdGhlIHVzZXIgYXR0YWNoZWQgdG8gdGhhdCBzZXNzaW9uXG4gICAgICAgICAgICAvLyB3aXRoIGEgcHJvbWlzZS4gVGhpcyBlbnN1cmVzIHRoYXQgd2UgY2FuXG4gICAgICAgICAgICAvLyBhbHdheXMgaW50ZXJmYWNlIHdpdGggdGhpcyBtZXRob2QgYXN5bmNocm9ub3VzbHkuXG5cbiAgICAgICAgICAgIC8vIE9wdGlvbmFsbHksIGlmIHRydWUgaXMgZ2l2ZW4gYXMgdGhlIGZyb21TZXJ2ZXIgcGFyYW1ldGVyLFxuICAgICAgICAgICAgLy8gdGhlbiB0aGlzIGNhY2hlZCB2YWx1ZSB3aWxsIG5vdCBiZSB1c2VkLlxuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0F1dGhlbnRpY2F0ZWQoKSAmJiBmcm9tU2VydmVyICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oU2Vzc2lvbi51c2VyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTWFrZSByZXF1ZXN0IEdFVCAvc2Vzc2lvbi5cbiAgICAgICAgICAgIC8vIElmIGl0IHJldHVybnMgYSB1c2VyLCBjYWxsIG9uU3VjY2Vzc2Z1bExvZ2luIHdpdGggdGhlIHJlc3BvbnNlLlxuICAgICAgICAgICAgLy8gSWYgaXQgcmV0dXJucyBhIDQwMSByZXNwb25zZSwgd2UgY2F0Y2ggaXQgYW5kIGluc3RlYWQgcmVzb2x2ZSB0byBudWxsLlxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3Nlc3Npb24nKS50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvbG9naW4nLCBjcmVkZW50aWFscylcbiAgICAgICAgICAgICAgICAudGhlbihvblN1Y2Nlc3NmdWxMb2dpbilcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHsgbWVzc2FnZTogJ0ludmFsaWQgbG9naW4gY3JlZGVudGlhbHMuJyB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9sb2dvdXQnKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBTZXNzaW9uLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9nb3V0U3VjY2Vzcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG4gICAgYXBwLnNlcnZpY2UoJ1Nlc3Npb24nLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgQVVUSF9FVkVOVFMpIHtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcblxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChzZXNzaW9uSWQsIHVzZXIpIHtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KCkpO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaG9tZS9ob21lLmh0bWwnXG4gICAgfSk7XG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvbG9naW4vbG9naW4uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgQXV0aFNlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgJHNjb3BlLmxvZ2luID0ge307XG4gICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5zZW5kTG9naW4gPSBmdW5jdGlvbiAobG9naW5JbmZvKSB7XG5cbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbihsb2dpbkluZm8pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLic7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21lbWJlcnNPbmx5Jywge1xuICAgICAgICB1cmw6ICcvbWVtYmVycy1hcmVhJyxcbiAgICAgICAgdGVtcGxhdGU6ICc8aW1nIG5nLXJlcGVhdD1cIml0ZW0gaW4gc3Rhc2hcIiB3aWR0aD1cIjMwMFwiIG5nLXNyYz1cInt7IGl0ZW0gfX1cIiAvPicsXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsIFNlY3JldFN0YXNoKSB7XG4gICAgICAgICAgICBTZWNyZXRTdGFzaC5nZXRTdGFzaCgpLnRoZW4oZnVuY3Rpb24gKHN0YXNoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnN0YXNoID0gc3Rhc2g7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBkYXRhLmF1dGhlbnRpY2F0ZSBpcyByZWFkIGJ5IGFuIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgIC8vIHRoYXQgY29udHJvbHMgYWNjZXNzIHRvIHRoaXMgc3RhdGUuIFJlZmVyIHRvIGFwcC5qcy5cbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgYXV0aGVudGljYXRlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9KTtcblxufSk7XG5cbmFwcC5mYWN0b3J5KCdTZWNyZXRTdGFzaCcsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gICAgdmFyIGdldFN0YXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL21lbWJlcnMvc2VjcmV0LXN0YXNoJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0U3Rhc2g6IGdldFN0YXNoXG4gICAgfTtcblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncXVlc3Rpb25zJywge1xuICAgICAgICB1cmw6ICcvZGlzY292ZXJ5JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9xdWVzdGlvbnMvcXVlc3Rpb25zLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnUXVlc3Rpb25DdHJsJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1F1ZXN0aW9uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgQXV0aFNlcnZpY2UsIFFTdGFja0ZhY3RvcnkpIHtcblxuICAgICRzY29wZS5xc3RhY2sgPSBRU3RhY2tGYWN0b3J5O1xuXG4gICAgLyoqXG4gICAgICogU3RhcnRzIGEgbmV3IHF1ZXN0aW9uIHByb2Nlc3NcbiAgICAgKiBAcmV0dXJuIHtbdW5kZWZpbmVkXX0gW1NpZGUgZWZmZWN0cyBvbmx5XVxuICAgICAqL1xuICAgICRzY29wZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUucXN0YWNrLnN0YXJ0KCk7XG4gICAgICAgICRzY29wZS5jdXJyZW50ID0gJHNjb3BlLnFzdGFjay5hZHZhbmNlKCk7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZCA9IG5ldyBNYXAoJHNjb3BlLnFzdGFjay5kaXNwbGF5ZWQubWFwKG5vZGUgPT4gW25vZGUuaWQsIGZhbHNlXSkpO1xuICAgIH1cblxuICAgIC8vIFN0YXJ0cyB0aGUgcXVlc3Rpb24gdHJlZSBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gICAgJHNjb3BlLnN0YXJ0KCk7XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGVzIHRoZSBub2RlIGFzIHNlbGVjdGVkLlxuICAgICAqIEBwYXJhbSAge1tPYmplY3RdfSBub2RlIFtRVHJlZV1cbiAgICAgKiBAcmV0dXJuIHtbT2JqZWN0XX0gICAgICBbVXNlZCBmb3Igc2lkZSBlZmZlY3RzIG9ubHldXG4gICAgICovXG4gICAgJHNjb3BlLnNlbGVjdCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkLnNldChub2RlLmlkLCAhJHNjb3BlLnNlbGVjdGVkLmdldChub2RlLmlkKSlcbiAgICAgICAgcmV0dXJuIG5vZGUuc2VsZWN0Tm9kZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdyYXBwZXIgYXJvdW5kIFFTdGFjaydzIGFkdmFuY2UgbWV0aG9kLiBVc2VzIGEgTWFwIG9mIGFsbCBzZWxlY3RlZCBub2RlcyB0byBwcmV2ZW50IGVycm9lbm91cyBzdWJtaXRzXG4gICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAgICovXG4gICAgJHNjb3BlLmFkdmFuY2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKFsuLi4kc2NvcGUuc2VsZWN0ZWQudmFsdWVzKCldLmV2ZXJ5KHZhbHVlID0+IHZhbHVlID09PSBmYWxzZSkpIHJldHVybjtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnQgPSAkc2NvcGUucXN0YWNrLmFkdmFuY2UoKTtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkLmNsZWFyKCk7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZCA9IG5ldyBNYXAoJHNjb3BlLnFzdGFjay5kaXNwbGF5ZWQubWFwKG5vZGUgPT4gW25vZGUuaWQsIGZhbHNlXSkpO1xuICAgIH1cblxufSk7XG4iLCJhcHAuZmFjdG9yeSgnRnVsbHN0YWNrUGljcycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3Z0JYdWxDQUFBWFFjRS5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9mYmNkbi1zcGhvdG9zLWMtYS5ha2FtYWloZC5uZXQvaHBob3Rvcy1hay14YXAxL3QzMS4wLTgvMTA4NjI0NTFfMTAyMDU2MjI5OTAzNTkyNDFfODAyNzE2ODg0MzMxMjg0MTEzN19vLmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1MS1VzaElnQUV5OVNLLmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjc5LVg3b0NNQUFrdzd5LmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1VajlDT0lJQUlGQWgwLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjZ5SXlGaUNFQUFxbDEyLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0UtVDc1bFdBQUFtcXFKLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0V2WkFnLVZBQUFrOTMyLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0VnTk1lT1hJQUlmRGhLLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0VReUlETldnQUF1NjBCLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0NGM1Q1UVc4QUUybEdKLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FlVnc1U1dvQUFBTHNqLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FhSklQN1VrQUFsSUdzLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FRT3c5bFdFQUFZOUZsLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1PUWJWckNNQUFOd0lNLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjliX2Vyd0NZQUF3UmNKLnBuZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjVQVGR2bkNjQUVBbDR4LmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjRxd0MwaUNZQUFsUEdoLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjJiMzN2UklVQUE5bzFELmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQndwSXdyMUlVQUF2TzJfLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQnNTc2VBTkNZQUVPaEx3LmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0o0dkxmdVV3QUFkYTRMLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0k3d3pqRVZFQUFPUHBTLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0lkSHZUMlVzQUFubkhWLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0dDaVBfWVdZQUFvNzVWLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0lTNEpQSVdJQUkzN3F1LmpwZzpsYXJnZSdcbiAgICBdO1xufSk7XG4iLCJhcHAuZmFjdG9yeSgnUmFuZG9tR3JlZXRpbmdzJywgZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGdldFJhbmRvbUZyb21BcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgcmV0dXJuIGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKV07XG4gICAgfTtcblxuICAgIHZhciBncmVldGluZ3MgPSBbXG4gICAgICAgICdIZWxsbywgd29ybGQhJyxcbiAgICAgICAgJ0F0IGxvbmcgbGFzdCwgSSBsaXZlIScsXG4gICAgICAgICdIZWxsbywgc2ltcGxlIGh1bWFuLicsXG4gICAgICAgICdXaGF0IGEgYmVhdXRpZnVsIGRheSEnLFxuICAgICAgICAnSVxcJ20gbGlrZSBhbnkgb3RoZXIgcHJvamVjdCwgZXhjZXB0IHRoYXQgSSBhbSB5b3Vycy4gOiknLFxuICAgICAgICAnVGhpcyBlbXB0eSBzdHJpbmcgaXMgZm9yIExpbmRzYXkgTGV2aW5lLicsXG4gICAgICAgICfjgZPjgpPjgavjgaHjga/jgIHjg6bjg7zjgrbjg7zmp5jjgIInLFxuICAgICAgICAnV2VsY29tZS4gVG8uIFdFQlNJVEUuJyxcbiAgICAgICAgJzpEJyxcbiAgICAgICAgJ1llcywgSSB0aGluayB3ZVxcJ3ZlIG1ldCBiZWZvcmUuJyxcbiAgICAgICAgJ0dpbW1lIDMgbWlucy4uLiBJIGp1c3QgZ3JhYmJlZCB0aGlzIHJlYWxseSBkb3BlIGZyaXR0YXRhJyxcbiAgICAgICAgJ0lmIENvb3BlciBjb3VsZCBvZmZlciBvbmx5IG9uZSBwaWVjZSBvZiBhZHZpY2UsIGl0IHdvdWxkIGJlIHRvIG5ldlNRVUlSUkVMIScsXG4gICAgXTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdyZWV0aW5nczogZ3JlZXRpbmdzLFxuICAgICAgICBnZXRSYW5kb21HcmVldGluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldFJhbmRvbUZyb21BcnJheShncmVldGluZ3MpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7XG4iLCJhcHAuZGlyZWN0aXZlKCduYXZiYXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgQXV0aFNlcnZpY2UsIEFVVEhfRVZFTlRTLCAkc3RhdGUpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2YmFyLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcblxuICAgICAgICAgICAgc2NvcGUuaXRlbXMgPSBbXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ0hvbWUnLCBzdGF0ZTogJ2hvbWUnIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ0Fib3V0Jywgc3RhdGU6ICdhYm91dCcgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiAnRG9jdW1lbnRhdGlvbicsIHN0YXRlOiAnZG9jcycgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiAnTWVtYmVycyBPbmx5Jywgc3RhdGU6ICdtZW1iZXJzT25seScsIGF1dGg6IHRydWUgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgc2NvcGUudXNlciA9IG51bGw7XG5cbiAgICAgICAgICAgIHNjb3BlLmlzTG9nZ2VkSW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHNldFVzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciByZW1vdmVVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLnVzZXIgPSBudWxsO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc2V0VXNlcigpO1xuXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MsIHNldFVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubG9nb3V0U3VjY2VzcywgcmVtb3ZlVXNlcik7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCwgcmVtb3ZlVXNlcik7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxufSk7XG4iLCJhcHAuZGlyZWN0aXZlKCdmdWxsc3RhY2tMb2dvJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvZnVsbHN0YWNrLWxvZ28vZnVsbHN0YWNrLWxvZ28uaHRtbCdcbiAgICB9O1xufSk7XG4iLCJhcHAuZGlyZWN0aXZlKCdyYW5kb0dyZWV0aW5nJywgZnVuY3Rpb24gKFJhbmRvbUdyZWV0aW5ncykge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZS5ncmVldGluZyA9IFJhbmRvbUdyZWV0aW5ncy5nZXRSYW5kb21HcmVldGluZygpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
