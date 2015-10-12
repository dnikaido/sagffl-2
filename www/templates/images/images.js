(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('ImagesController', ImagesController);

  function ImagesController($log, Images, $state, $facebook, $filter, imagesResolve, Gallery, $rootScope) {
    var vm = this;

    vm.addImage = addImage;
    vm.currentVote = currentVote;
    vm.countVotes = countVotes;
    vm.comment = comment;
    vm.images = orderImages(imagesResolve);
    vm.gallery = Gallery;
    vm.toggleVote = toggleVote;
    vm.username = null;

    $rootScope.$on('nav.images', function() {
      activate();
    });

    activate();

    function activate() {
      $facebook.getCurrentUser()
        .then(function(response) {
          vm.username = response.data.name;
        });

      vm.gallery.images = vm.images;
    }

    function addImage() {
      $state.go('nav.images-add');
    }

    function comment(image) {
      $state.go('nav.images-comment', { key : image.$id });
    }

    function countVotes(image) {
      if(image.hasOwnProperty('votes')===true) {
        return image.votes.length;
      }
      return 0;
    }

    function currentVote(image) {
      if(vm.username) {
        return _.contains(image.votes, vm.username);
      }
    }

    function orderImages(images, newOrder, newReverse) {
      var order = newOrder ? newOrder : countVotes;
      var reverse = newReverse ? newReverse : true;
      return $filter('orderBy')(images, order, reverse);
    }

    function toggleVote(image) {
      if(vm.username) {
        Images.toggleVote(image, vm.username);
      } else {
        $facebook.getCurrentUser('nav.images', true)
          .then(function (response) {
            vm.username = response.data.name;
            Images.toggleVote(image, vm.username);
          })
          .catch(function (error) {
            $log.debug(error);
          });
      }
    }

  }
  function configRoute($stateProvider) {
    $stateProvider
      .state('nav.images', {
        url: '/images',
        resolve: {
          imagesResolve : imageResolve
        },
        views: {
          'main': {
            templateUrl: 'templates/images/images.html',
            controller: 'ImagesController as vm'
          }
        }
      })
      .state('nav.images-add', {
        url: '/images/add',
        cache: false,
        views: {
          'main': {
            templateUrl: 'templates/images/add/images.add.html',
            controller: 'ImagesAddController as vm'
          }
        }
      })
      .state('nav.images-comment', {
        url: '/images/comment/:key',
        cache: false,
        resolve: {
          imagesResolve : imageResolve
        },
        views: {
          'main': {
            templateUrl: 'templates/images/comment/images.comment.html',
            controller: 'CommentsController as comment'
          }
        }
      })
  }

  function imageResolve(Images) {
    return Images.getImages();
  }
})();

