(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .filter('beforeNow', beforeNow)
    .controller('ScheduleController', ScheduleController);

  function ScheduleController($log, $state, $stateParams, $leagueapps, $filter) {
    var vm = this;
    var programId = $stateParams.id;
    var errorMessage = 'Unfortunately the schedule is not available at this time.';

    vm.$state = $state;
    vm.upcomingGames = [];
    vm.playedGames = [];
    vm.dateFormat = 'MMM d, y h:mm a';
    vm.timeZone = '-0400';

    activate();

    function activate() {
      vm.error = null;
      $leagueapps.getSchedule(programId)
        .then(function(schedule) {
          var beforeNow = $filter('beforeNow');
          vm.playedGames = beforeNow(schedule.games, true);
          vm.upcomingGames = beforeNow(schedule.games, false);
        }, function(error) {
          $log.debug(error);
          vm.error = errorMessage;
        });
    }
  }

  function beforeNow() {
    return function(games, beforeNow) {
      var filteredGames = _.filter(games, function(game) {
        return moment().isAfter(game.startTime) ? beforeNow : !beforeNow;
      });
      return filteredGames;
    };
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

