(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('HomeController', HomeController);

  function HomeController($log, $leagueapps, Images, $scope, $ionicSlideBoxDelegate) {
    var vm = this;

    vm.firstAnnouncement = {};
    vm.imageSlides = null;

    activate();

    function activate() {
      $leagueapps.getAnnouncements()
        .then(function(response) {
          if(response && response.length > 0) {
            var announcement = response[0];
            if(announcement.message.length > 100) {
              announcement = setPreviewMessage(announcement);
            }
            vm.firstAnnouncement = announcement;
          }
        }, function(error) {
          $log.debug(error);
        });

      $scope.$on('imageArraysLoaded', function() {
        var topImages = Images.getTopImages();
        vm.imageSlides = _.pluck(topImages, 'url');
        $ionicSlideBoxDelegate.$getByHandle('home').update();
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
