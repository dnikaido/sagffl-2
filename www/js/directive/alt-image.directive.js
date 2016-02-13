(function () {
  'use strict';

  angular.module('sagffl')
    .directive('altImage', altImageDirective);

  function altImageDirective() {
    return {
      restrict: 'A',
      link: altImageLink
    };

    function altImageLink(scope, element, attrs) {
      if(element[0].tagName === 'IMG') {
        element.bind('error', function() {
          element.bind('error', null);
          var altImage = attrs.altImage
            ? attrs.altImage
            :  '../img/diablos-head.jpg';
          element[0].src = altImage;
        });
      }
    }
  }
})();


