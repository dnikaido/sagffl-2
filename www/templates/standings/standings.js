(function () {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('StandingsController', StandingsController);

  StandingsController.$inject = ['$log', '$leagueapps', '$stateParams'];
  function StandingsController($log, $leagueapps, $stateParams) {
    var vm = this;

    vm.programId = $stateParams.id;

    //activate();

    function activate() {
      $leagueapps.getStandings(programId)
        .then(function(data) {
          $log.debug(data);
        })
        .catch(function(error) {
          $log.debug(error);
        })
    }
  }

  function configRoute($stateProvider) {
    $stateProvider
      .state('nav.standings', {
        url: '/programs/:id/standings',
        views: {
          'main': {
            templateUrl: 'templates/standings/standings.html',
            controller: 'StandingsController as vm'
          }
        }
      })
  }
})();
