(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('LoginController', LoginController);

  function LoginController($facebook, $stateParams) {
    var toState = $stateParams.toState ? $stateParams.toState : 'nav.home';

    activate();

    function activate() {
      $facebook.login(toState);
    }

  }
  function configRoute($stateProvider) {
    $stateProvider
      .state('nav.login', {
        url: '/login/:toState',
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
