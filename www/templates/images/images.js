(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('ImagesController', ImagesController);

  function ImagesController($log, Images, $state, $facebook, Gallery, $ionicSlideBoxDelegate, $scope) {
    var vm = this;

    vm.activeCategory = 0;
    vm.categories = [];
    vm.selectedCategory = null;
    vm.username = null;

    vm.addImage = addImage;
    vm.currentVote = currentVote;
    vm.comment = comment;
    vm.gallery = Gallery;
    vm.selectCategory = selectCategory;
    vm.toggleVote = toggleVote;

    $scope.$on('$ionicView.enter', function() {
      activate();
    });

    function activate() {
      $facebook.getCurrentUser()
        .then(function(response) {
          vm.username = response.data.name;
        });
      Images.getCategories()
        .then(function(categories) {
          vm.categories = categories;
          if(!vm.activeCategory) {
            selectCategory(0);
          } else {
            selectCategory(vm.activeCategory);
          }
        });
    }

    function addImage() {
      $state.go('nav.images-add', { categoryIndex : vm.activeCategory });
    }

    function comment(image) {
      $state.go('nav.images-comment', { key : image.$id });
    }

    function currentVote(image) {
      if(vm.username) {
        return _.contains(image.votes, vm.username);
      }
    }

    function selectCategory(index) {
      vm.activeCategory = index;
      $ionicSlideBoxDelegate.update();
    }

    function toggleVote(image) {
      if(vm.username) {
        Images.toggleVote(image, vm.username)
          .catch(function(error) {
            $log.debug(error);
          });
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
        params: {
          categoryIndex : ''
        },
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
        views: {
          'main': {
            templateUrl: 'templates/images/comment/images.comment.html',
            controller: 'CommentsController as comment'
          }
        }
      })
  }
})();

