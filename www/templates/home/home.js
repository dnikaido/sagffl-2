(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('HomeController', HomeController);

  function HomeController($log, $leagueapps) {
    var vm = this;

    vm.firstAnnouncement = {};

    activate();

    function activate() {
      $leagueapps.getAnnouncements()
        .success(function(response) {
          if(response && response.length > 0) {
            var announcement = response[0];
            if(announcement.message.length > 100) {
              announcement = setPreviewMessage(announcement);
            }
            vm.firstAnnouncement = announcement;
          }
        })
        .catch(function(error) {
          $log.debug(error);
        });
    }

    function setPreviewMessage(announcement) {
      var message = announcement.message.substring(0, 100);
      message = message.replace(/(<br\/>)/g, ' ');
      message += ' . . .';
      announcement.message = message;
      return announcement;
    }

  }

  function configRoute($stateProvider) {
    $stateProvider
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
