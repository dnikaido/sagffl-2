(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('AnnouncementsController', AnnouncementsController);

  function AnnouncementsController() {

  }
  function configRoute($stateProvider) {
    $stateProvider
      .state('nav.announcements', {
        url: '/announcements',
        views: {
          'main': {
            templateUrl: 'templates/announcements/announcements.html',
            controller: 'AnnouncementsController as vm'
          }
        }
      })
  }
})();

