(function() {
  'use strict';

  angular.module('sagffl')
    .directive('imageCategory', imageCategory);

  function imageCategory() {
    return {
      templateUrl : 'templates/images/slide-box/images.slide-box.html',
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
          Images.getImages($scope.category.$id)
            .then(function(images) {
              $scope.orderedImages = orderImages(images);
              $scope.reloadImages = false;
            });
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

