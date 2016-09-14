app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/discovery',
        templateUrl: 'js/questions/questions.html',
        controller: 'QuestionCtrl'
    });

});

app.controller('QuestionCtrl', function ($scope, AuthService) {

});
