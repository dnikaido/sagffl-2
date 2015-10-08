(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('ImagesController', ImagesController);

  function ImagesController($log, Images, $state) {
    var vm = this;

    vm.addImage = addImage;
    vm.images = Images.getImages();


    function addImage() {
      $state.go('nav.images-add');
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
      .state('nav.images-add', {
        url: '/images/add',
        cache: false,
        views: {
          'main': {
            templateUrl: 'templates/images/add/images.add.html',
            controller: 'ImagesAddController as vm'
          }
        }
      })
  }
})();

