(function () {
  'use strict';

  angular.module('sagffl', [
    'sagffl.config',
    'ionic',
    'firebase',
    'ngStorage',
    'ng-mfb',
    'myFacebook'
  ])
    .config(configRoutes)
    .run(configIonic)
    .run(watchRoutes)
    .run(configStorage);

  function configStorage($localStorage) {
    $localStorage.$reset();
  }

  function watchRoutes($log, $rootScope) {
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      $log.debug('error changing to state: ' + toState.name + ' error:' + error);
    });
  }

  function configRoutes($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
      .state('nav', {
        abstract: true,
        templateUrl: 'templates/nav/nav.html',
        controller: 'NavController as vm'
      })
      .state('nav.home', {
        url: '/home',
        views: {
          'main': {
            templateUrl: 'templates/home/home.html',
            controller: 'HomeController as vm'
          }
        }
      });

  }

  function configIonic($ionicPlatform, $ionicConfig) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });

    $ionicConfig.backButton.text('');
    $ionicConfig.backButton.previousTitleText('');
    $ionicConfig.tabs.position('bottom');

  }
})();


