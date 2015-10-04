(function () {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('ProgramsController', ProgramsController);

  ProgramsController.$inject = ['$log', '$leagueapps'];
  function ProgramsController($log, $leagueapps) {
    var vm = this;

    vm.programs = [];

    activate();

    function activate() {
      $leagueapps.getPrograms()
        .success(function(response) {
            $log.debug(response);
            vm.programs = response;
        })
        .catch(function(error) {
            $log.debug(error);
        });
    }
  }

  function configRoute($stateProvider) {
    $stateProvider
      .state('nav.programs', {
        url: '/programs',
        views: {
          'main': {
            templateUrl: 'templates/programs/programs.html',
            controller: 'ProgramsController as vm'
          }
        }
      })
  }
})();
