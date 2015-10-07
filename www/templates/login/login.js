(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('LoginController', LoginController);

  function LoginController($facebook, $stateParams) {
    var toState = $stateParams.toState ? $stateParams.toState : 'nav.home';
    var permissions = $stateParams.permissions ? $stateParams.permissions : null;

    activate();

    function activate() {
      $facebook.login(toState, permissions);
    }

  }
  function configRoute($stateProvider) {
    $stateProvider
      .state('nav.login', {
        url: '/login/:toState/:permissions',
        cache: false,
        views: {
          'main': {
            templateUrl: 'templates/login/login.html',
            controller: 'LoginController as vm'
          }
        }
      })
  }

})();
