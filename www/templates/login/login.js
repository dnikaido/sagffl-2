(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('LoginController', LoginController);

  function LoginController($log, $facebook, $state, $stateParams, $ionicPopup) {
    var vm = this;
    var toState = $stateParams.toState ? $stateParams.toState : 'nav.home';
    var options = $stateParams.options ? $stateParams.options : {};
    var permissions = $stateParams.permissions ? $stateParams.permissions : null;

    vm.needPhotos = null;

    vm.login = login;

    activate();

    function activate() {
      checkPermissions();
    }

    function checkPermissions() {
      vm.needPhotos = _.contains(permissions, $facebook.permission.PHOTOS);
    }

    function login() {
      $facebook.login(toState, options, permissions)
        .catch(function(error) {
          if(error==='Invalid permissions'
            || error==='The sign in flow was canceled') {
            $state.go('nav.home')
          }
          if(error==='Permission denied') {
            var confirmPopup = $ionicPopup.confirm({
              title: 'Photo Access',
              template: 'You can upload photos if you grant us permission to access your Facebook photos.',
              cancelText: 'Don\'t allow',
              okText: 'Grant permission'
            });
            confirmPopup.then(function(response) {
              if(response) {
                $facebook.loginRerequest(toState, options, permissions)
                  .catch(function(error) {
                    $log.debug(error);
                    $state.go('nav.home')
                  });
              } else {
                $state.go('nav.home')
              }
            });
          }
        });
    }

  }
  function configRoute($stateProvider) {
    $stateProvider
      .state('nav.login', {
        url: '/login',
        cache: false,
        params: {
          toState : null,
          options : null,
          permissions : null
        },
        views: {
          'main': {
            templateUrl: 'templates/login/login.html',
            controller: 'LoginController as vm'
          }
        }
      })
  }

})();
