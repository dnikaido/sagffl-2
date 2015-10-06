(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('ImagesController', ImagesController);

  function ImagesController($log, $rootScope, $ionicPopup, Images, $facebook) {
    var vm = this;

    vm.addImage = addImage;
    vm.images = Images.getImages();


    function addImage() {
      $facebook.getAlbums('nav.images')
        .then(function(response) {
          $log.debug(response);
        });
    //  var addScope = $rootScope.$new();
      //  addScope.data = {};
      //  $ionicPopup.show({
      //    template: '<input ng-model="data.url">',
      //    title: 'Enter Image URL',
      //    scope: addScope,
      //    buttons: [
      //      {text: 'Cancel'},
      //      {
      //        text: 'Add',
      //        type: 'button-positive',
      //        onTap: function (e) {
      //          if (!addScope.data.url) {
      //            e.preventDefault();
      //          } else {
      //            return addScope.data.url;
      //          }
      //        }
      //      }
      //    ]
      //  })
      //    .then(function(url) {
      //      Images.addImage(url);
      //    });
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

