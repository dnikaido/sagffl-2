(function () {
  'use strict';

  angular.module('sagffl')
    .factory('Images', ImagesService);

  function ImagesService($firebaseArray) {
    var imageRef = new Firebase('https://glowing-torch-8356.firebaseio.com/images'),
        imageFire = $firebaseArray(imageRef);

    return {
      addImage : addImage,
      getImages : getImages
    };

    function getImages() {
      return imageFire;
    }

    function addImage(url) {
      imageFire.$add(url);
    }
  }
})();
