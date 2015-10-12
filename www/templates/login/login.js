(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('LoginController', LoginController);

  function LoginController($facebook, $stateParams) {
    var toState = $stateParams.toState ? $stateParams.toState : 'nav.home';
    var options = $stateParams.options ? $stateParams.options : {};
    var permissions = $stateParams.permissions ? $stateParams.permissions : null;

    activate();

    function activate() {
      $facebook.login(toState, options, permissions);
    }

  }
  function configRoute($stateProvider) {
    $stateProvider
      .state('nav.login', {
        url: '/login',
        params: {
          toState : null,
          options : null,
          permissions : null
        },
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
