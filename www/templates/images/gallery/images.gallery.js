(function() {
  'use strict';

  angular.module('sagffl')
    .factory('Gallery', GalleryService);

  function GalleryService($rootScope, $ionicModal, $ionicScrollDelegate, $ionicSlideBoxDelegate) {
    var $scope = $rootScope.$new();

    $scope.activeSlide = '';
    $scope.lastPosition = {};
    $scope.modal = {};
    $scope.zoomMin = 1;
    $scope.showImage = showImage;
    $scope.showImages = showImages;
    $scope.showModal = showModal;
    $scope.closeModal = closeModal;
    $scope.closeable = false;
    $scope.updateSlideStatus = updateSlideStatus;
    $scope.images = [];

    return $scope;

    function showImages(index) {
      $scope.activeSlide = index;
      $scope.showModal('templates/images/gallery/images.gallery.html');
    }

    function showImage(image) {
      $scope.images = [image];
      $scope.activeSlide = 0;
      $scope.showModal('templates/images/gallery/images.gallery.html');
    }

    function showModal(templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: this
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    }

    function closeModal() {
      var slideBox = $ionicSlideBoxDelegate._instances[0];
      if(!slideBox.slideIsDisabled && slideBox.closeable) {
        $scope.modal.hide();
        $scope.modal.remove()
      }
    }

    function updateSlideStatus(slide) {
      var scroll = _.findWhere($ionicScrollDelegate._instances, { $$delegateHandle : 'scrollHandle' + slide });
      var slideBox = $ionicSlideBoxDelegate._instances[0];
      var currentPosition = scroll.getScrollPosition();
      var checkZoomPosition = currentPosition.zoom == $scope.zoomMin;
      slideBox.closeable = _.isEqual(currentPosition, $scope.lastPosition);
      if (checkZoomPosition) {
        slideBox.enableSlide(true);
      } else {
        slideBox.enableSlide(false);
      }
      $scope.lastPosition = scroll.getScrollPosition();
    }
  }

})();

