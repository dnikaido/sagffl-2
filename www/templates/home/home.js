(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('HomeController', HomeController)
    .directive('dynamicSlides', dynamicSlides);

  function HomeController($log, $leagueapps, Images, $scope, $window) {
    var vm = this;

    vm.firstAnnouncement = null;
    vm.imageSlides = null;
    vm.upcomingPrograms = null;

    vm.openInBrowser = openInBrowser;

    activate();

    function activate() {
      loadLatestAnnouncement();
      loadTopImages();
      loadUpcomingPrograms();
    }

    function loadLatestAnnouncement() {
      $leagueapps.getAnnouncements()
        .then(function(announcements) {
          if(announcements && announcements.length > 0) {
            var announcement = announcements[0];
            var createdTime = moment(announcement.createdTime);
            var oneMonthAgo = moment().subtract(1, 'month');
            if(createdTime.isAfter(oneMonthAgo)) {
              if(announcement.message.length > 100) {
                announcement = setPreviewMessage(announcement);
              }
              vm.firstAnnouncement = announcement;
            }
          }
        }, function(error) {
          $log.debug(error);
        });

      function setPreviewMessage(announcement) {
        var message = announcement.message.substring(0, 100);
        message = message.replace(/(<br\/>)/g, ' ');
        message += ' . . .';
        announcement.message = message;
        return announcement;
      }
    }

    function loadUpcomingPrograms() {
      $leagueapps.getPrograms()
        .then(function(programs) {
          if(programs) {
            vm.upcomingPrograms = _.where(programs, { state: 'LIVE' });
          }
        }, function(error) {
          $log.debug(error);
        })
    }

    function loadTopImages() {
      var images = Images.getTopImages();
      if(images) {
        vm.imageSlides = _.pluck(images, 'url');
      } else {
        $scope.$on('imageArraysLoaded', function() {
          var topImages = Images.getTopImages();
          vm.imageSlides = _.pluck(topImages, 'url');
          if(!vm.imageSlides.length) {
            vm.imageSlides.push('/img/diablos-head.jpg');
          }
        });
      }
    }

    function openInBrowser(url) {
      $window.open(url, '_system');
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

  function dynamicSlides() {
    return {
      require: ['^ionSlideBox'],
      link: function(scope, elem, attrs, slider) {
        scope.$watch(function() {
          return scope.$eval(attrs.dynamicSlides).length;
        }, function() {
          var thisSlider = slider[0].__slider;
          thisSlider.update();
          thisSlider.loop(5000);
        });
      }
    };
  }
})();
