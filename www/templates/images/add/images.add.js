(function() {
  'use strict';

  angular.module('sagffl')
    .controller('ImagesAddController', ImagesAddController);

  function ImagesAddController($log, $facebook, $document, $rootScope, $ionicPopup, Images, $state, $ionicScrollDelegate, $stateParams) {
    var vm = this;
    var duplicateError = 'Oops! That photo has already been submitted. Please choose another.';
    var submitError = 'Oops! There was an upload error. Sad face.';

    vm.albums = {};
    vm.categoryIndex = $stateParams.categoryIndex;
    vm.photos = {};
    vm.username = '';
    vm.selectedPhoto = '';

    vm.clickPhoto = clickPhoto;
    vm.selectAlbum = selectAlbum;
    vm.selectPhoto = selectPhoto;

    activate();

    function activate() {
      $facebook.getAlbums('nav.images-add', { categoryIndex : vm.categoryIndex })
        .then(function(response) {
          vm.albums = response.data.albums;
          setScrollHeight();
          $facebook.getCurrentUser('nav.images-add')
            .then(function(response) {
              vm.username = response.data.name;
            });
        })
        .catch(function(error) {
          $log.debug(error);
        });
    }

    function clickPhoto(photo, index) {
      if(vm.selectedPhoto===index) {
        selectPhoto(photo);
      } else {
        vm.selectedPhoto = index;
      }
    }

    function selectAlbum(albumId) {
      $facebook.getAlbumPhotos(albumId, 'nav.images-add')
        .then(function(response) {
          vm.photos = response.data.photos;
          vm.selectedPhoto = '';
          $ionicScrollDelegate.$getByHandle('photos').scrollTop(false);
        })
        .catch(function(error) {
          $log.debug(error);
        });
    }

    function selectPhoto(photo) {
      var selectScope = $rootScope.$new();
      selectScope.data = {};
      $ionicPopup.show({
        template: '<div><img style="width:100%" ng-src="' + photo.picture + '"></div><input ng-model="data.title">',
        title: 'Give your image a title:',
        scope: selectScope,
        buttons: [
          {text: 'Cancel'},
          {
            text: 'Upload',
            type: 'button-positive',
            onTap: function (e) {
              if (!selectScope.data.title) {
                e.preventDefault();
              } else {
                return selectScope.data.title;
              }
            }
          }
        ]
      })
        .then(function(title) {
          if(title) {
            uploadPhoto(photo, title);
          }
        });
    }

    function setScrollHeight() {
      var content = $document[0].getElementById('albums-content');
      var scrolls = $document.find('ion-scroll');
      for (var index = 0; index < scrolls.length; index++) {
        scrolls[index].style.height = content.clientHeight + 'px';
      }
    }

    function uploadPhoto(photo, title) {
      $log.debug(photo);
      $facebook.getPhoto(photo.id)
        .then(function(response) {
          var images = response.data.images;
          var minimumWidth = 300;
          var smallImage;
          var zoomImage = _.max(images, function(image) { return image.width });
          if(zoomImage.width < minimumWidth) {
            smallImage = zoomImage;
          } else {
            smallImage = _.chain(images)
              .filter(function(image) { return image.width >= minimumWidth; })
              .min(function(image) { return image.width; })
              .value();
          }
          var uploadPhoto = {
            url : smallImage.source,
            zoomUrl : zoomImage.source,
            title : title,
            uploader : vm.username
          };
          if(validatePhoto(uploadPhoto)) {
            if(!duplicatePhoto(uploadPhoto)) {
              Images.addImage(uploadPhoto, vm.categoryIndex)
                .catch(function(error) {
                  $log.debug(error);
                  errorPopup(submitError);
                });
              $state.go('nav.images');
            } else {
              errorPopup(duplicateError);
            }
          } else {
            errorPopup(submitError);
          }
        })
        .catch(function(error) {
          $log.debug(error);
        });
    }

    function errorPopup(message) {
      $ionicPopup.alert({
        title: 'Couldn\'t submit...',
        template: message
      });
    }

    function validatePhoto(photo) {
      var validPhoto = photo.url !== 'undefined' && photo.url !== null
        && photo.zoomUrl !== 'undefined' && photo.zoomUrl !== null
        && photo.title !== 'undefined' && photo.title !== null
        && photo.uploader !== 'undefined' && photo.uploader !== null;
      return validPhoto;
    }

    function duplicatePhoto(photo) {
      var category = Images.getCategory(vm.categoryIndex);
      if(category) {
        return _.some(category.images, function(image) {
          return photo.url===image.url;
        });
      }

    }
  }
})();

