(function() {
  'use strict';

  angular.module('sagffl')
    .directive('imageCategory', imageCategory);

  function imageCategory() {
    return {
      templateUrl : 'templates/images/slide-box/images.slide-box.html',
      scope : {
        category : '='
      },
      controller: function($scope, $rootScope, Images, $filter) {
        $scope.orderedImages = [];
        $scope.vm = $scope.$parent.vm;

        $scope.count = count;

        $rootScope.$on('nav.images', function() {
         activate();
        });

        activate();

        function activate() {
          Images.getImages($scope.category.$id)
            .then(function(images) {
              $scope.orderedImages = orderImages(images);
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

