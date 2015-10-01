(function () {
  'use strict';

  angular.module('sagffl', [
    'ionic',
    'ngMaterial',
    'firebase'
  ])
    .config(configRoutes)
    .config(configMaterial)
    .run(configIonic);


  function configMaterial($mdIconProvider) {
    $mdIconProvider
      .icon('menu', 'img/icons/menu.svg', 24)
      .icon('chevron-left', 'img/icons/chevron-left.svg', 24)
      .icon('plus', 'img/icons/plus.svg', 24);
  }
  function configIonic($ionicPlatform) {
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
})();
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

