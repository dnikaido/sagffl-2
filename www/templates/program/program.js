(function () {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('ProgramController', ProgramController);

  ProgramController.$inject = ['$log', '$leagueapps', '$stateParams'];
  function ProgramController($log, $leagueapps, $stateParams) {
    var vm = this;

    vm.programs = [];
    vm.programId = $stateParams.id;

    activate();

    function activate() {
      $leagueapps.getPrograms()
        .success(function(response) {
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
        url: '/program',
        views: {
          'main': {
            templateUrl: 'templates/program/programs.html',
            controller: 'ProgramController as vm'
          }
        }
      })
      .state('nav.program', {
        url: '/program/:id',
        views: {
          'main': {
            templateUrl: 'templates/program/program.html',
            controller: 'ProgramController as vm'
          }
        }
      })
  }
})();
