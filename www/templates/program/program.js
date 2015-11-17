(function () {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('ProgramController', ProgramController);

  ProgramController.$inject = ['$log', '$leagueapps', '$stateParams', '$window'];
  function ProgramController($log, $leagueapps, $stateParams, $window) {
    var vm = this;

    vm.programs = null;
    vm.program = null;

    vm.openInBrowser = openInBrowser;

    activate();

    function activate() {
      $leagueapps.getPrograms()
        .then(function(programs) {
            vm.programs = programs;
            if($stateParams.index) {
              vm.program = vm.programs[$stateParams.index];
            }
        }, function(error) {
            $log.debug(error);
        });
    }

    function openInBrowser(url) {
      $window.open(url, '_system');
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
        url: '/program/:index',
        views: {
          'main': {
            templateUrl: 'templates/program/program.html',
            controller: 'ProgramController as vm'
          }
        }
      })
  }
})();
