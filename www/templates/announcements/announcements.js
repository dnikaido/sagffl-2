(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('AnnouncementsController', AnnouncementsController);

  function AnnouncementsController($log, $leagueapps) {
    var vm = this;

    vm.announcements = [];

    activate();

    function activate() {
      $leagueapps.getAnnouncements()
        .then(function(response) {
          vm.announcements = response;
        }, function(error) {
          $log.debug(error);
        });
    }
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

