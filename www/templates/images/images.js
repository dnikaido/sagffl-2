(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('ImagesController', ImagesController);

  function ImagesController($mdDialog, Images) {
    var vm = this;

    vm.addImage = addImage;
    vm.images = Images.getImages();


    function addImage(event) {
      $mdDialog.show({
        targetEvent: event,
        templateUrl: 'templates/images/images.add.html',
        controller: function($scope, $mdDialog) {
          $scope.submit = function() {
            if($scope.url) {
              $mdDialog.hide($scope.url)
            } else {
              $mdDialog.cancel();
            }
          }
          $scope.cancel = function() {
            $mdDialog.cancel();
          }
        }
      })
        .then(function(url) {
          console.log(url);
          Images.addImage(url);
        });
    }
  }
  function configRoute($stateProvider) {
    $stateProvider
      .state('nav.images', {
        url: '/images',
        views: {
          'main': {
            templateUrl: 'templates/images/images.html',
            controller: 'ImagesController as vm'
          }
        }
      })
  }
})();

