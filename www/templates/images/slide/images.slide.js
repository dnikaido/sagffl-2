(function() {
  'use strict';

  angular.module('sagffl')
    .directive('imageSlide', imageSlide);

  function imageSlide() {
    return {
      templateUrl : 'templates/images/slide/images.slide.html',
      scope : {
        category : '=',
        reloadImages : '='
      },
      controller: function($scope, Images, $filter) {
        $scope.orderedImages = [];
        $scope.vm = $scope.$parent.vm;

        $scope.count = count;

        $scope.$watch('reloadImages', function(reloadImages) {
          if(reloadImages) {
            activate();
          }
        });

        activate();

        function activate() {
          if($scope.category) {
            Images.getImages($scope.category.$id)
              .then(function(images) {
                $scope.orderedImages = orderImages(images);
                $scope.reloadImages = false;
              });
          }
        }

        function count(property) {
          return property ? property.length : 0;
        }

        function countVotes(image) {
          return count(image.votes);
        }

        function orderImages(images, newOrder, newReverse) {
          var order = newOrder ? newOrder : countVotes;
          var reverse = newReverse ? newReverse : true;
          return $filter('orderBy')(images, order, reverse);
        }
      }
    };
  }
})();

