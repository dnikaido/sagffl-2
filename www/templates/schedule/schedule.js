(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('ScheduleController', ScheduleController);

  function ScheduleController($log, $state, $stateParams, $leagueapps) {
    var vm = this;
    var programId = $stateParams.id;
    var errorMessage = 'Unfortunately the schedule is not available at this time.';

    vm.$state = $state;
    vm.schedule = [];
    vm.dateFormat = 'MMM d, y h:mm a';
    vm.timeZone = '-0400';
    vm.typeUpcoming = 'SCHEDULED';
    vm.typePlayed = 'PLAYED_REGULAR_TIME';

    activate();

    function activate() {
      $log.debug('heyo');
      vm.error = null;
      $leagueapps.getSchedule(programId)
        .success(function(response) {
          vm.schedule = response;
        })
        .catch(function(error) {
          $log.debug(error);
          vm.error = errorMessage;
        });
    }
  }
  function configRoute($stateProvider) {
    $stateProvider
      .state('nav.schedule', {
        url: 'program/:id/schedule',
        views: {
          'main': {
            templateUrl: 'templates/schedule/schedule.html',
            controller: 'ScheduleController as vm'
          }
        }
      })
      .state('nav.schedule.upcoming', {
        views: {
          'schedule': {
            templateUrl: 'templates/schedule/schedule.upcoming.html'
          }
        }
      })
      .state('nav.schedule.played', {
        views: {
          'schedule': {
            templateUrl: 'templates/schedule/schedule.played.html'
          }
        }
      })
  }
})();

