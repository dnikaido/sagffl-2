(function() {
  'use strict';

  angular.module('sagffl')
    .controller('ImagesAddController', ImagesAddController);

  function ImagesAddController($log, $facebook, $document, $rootScope, $ionicPopup, Images, $state, $ionicScrollDelegate) {
    var vm = this;

    vm.albums = {};
    vm.photos = {};
    vm.selectAlbum = selectAlbum;
    vm.selectPhoto = selectPhoto;
    vm.username = '';

    activate();

    function activate() {
      $facebook.getAlbums('nav.images-add')
        .then(function(response) {
          vm.albums = response.data.albums;
          vm.username = response.data.name;
          setScrollHeight();
        })
        .catch(function(error) {
          $log.debug(error);
        });
    }

    function selectAlbum(albumId) {
      $facebook.getAlbumPhotos(albumId, 'nav.images-add')
        .then(function(response) {
          vm.photos = response.data.photos;
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
            Images.addImage(uploadPhoto);
          } else {
            $log.debug('error validating photo upload');
          }
          $state.go('nav.images');

        })
        .catch(function(error) {
          $log.debug(error);
        });
    }

    function validatePhoto(photo) {
      return photo.url !== 'undefined' && photo.url !== null
        && photo.zoomUrl !== 'undefined' && photo.zoomUrl !== null
        && photo.title !== 'undefined' && photo.title !== null
        && photo.uploader !== 'undefined' && photo.uploader !== null;
    }
  }
})();

