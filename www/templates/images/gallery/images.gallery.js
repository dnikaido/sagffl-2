(function() {
  'use strict';

  angular.module('sagffl')
    .factory('Gallery', GalleryService);

  function GalleryService($rootScope, $ionicModal, $ionicScrollDelegate) {
    var $scope = $rootScope.$new();
    var $this = this;

    $this.closeable = false;
    $this.modal = null;
    $this.showModal = showModal;
    $this.lastPosition = {};

    $scope.zoomMin = 1;
    $scope.showImage = showImage;
    $scope.closeModal = closeModal;
    $scope.closeable = false;
    $scope.updateStatus = updateStatus;
    $scope.image = {};

    return $scope;

    function showImage(image) {
      $scope.image = image;
      $this.showModal('templates/images/gallery/images.gallery.html');
    }

    function showModal(templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope
      }).then(function(modal) {
        $this.modal = modal;
        $this.modal.show();
      });
    }

    function closeModal() {
      if($this.closeable) {
        $this.modal.hide();
        $this.modal.remove()
      }
    }

    function updateStatus() {
      var scroll = _.findWhere($ionicScrollDelegate._instances, { $$delegateHandle : 'scrollHandle'});
      var currentPosition = scroll.getScrollPosition();
      var checkZoomPosition = currentPosition.zoom == $scope.zoomMin;
      var checkLastPosition= _.isEqual(currentPosition, $this.lastPosition);
      $this.closeable = !!(checkZoomPosition || checkLastPosition);
      $this.lastPosition = scroll.getScrollPosition();
    }
  }

})();

