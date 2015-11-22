(function() {
  'use strict';

  angular.module('sagffl')
    .config(configRoute)
    .controller('ImagesController', ImagesController);

  function ImagesController($log, Images, $state, $facebook, Gallery, $scope, $ionicScrollDelegate, Util) {
    var vm = this;

    vm.activeCategory = null;
    vm.activeCategoryIndex = 0;
    vm.categories = [];
    vm.gallery = Gallery;
    vm.reloadImages = false;
    vm.username = null;

    vm.addImage = addImage;
    vm.currentVote = currentVote;
    vm.comment = comment;
    vm.getFromNow = Util.getFromNow;
    vm.nextCategory = nextCategory;
    vm.previousCategory = previousCategory;
    vm.scrollTop = scrollTop;
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
          vm.reloadImages = true;
          selectCategory(vm.activeCategoryIndex);
        });
    }

    function addImage() {
      $state.go('nav.images-add', { categoryIndex : vm.activeCategoryIndex });
    }

    function nextCategory() {
      addCategoryIndex(1);
    }

    function previousCategory() {
      addCategoryIndex(-1);
    }

    function addCategoryIndex(addToIndex) {
      var categoriesLength = vm.categories.length;
      var newIndex =  vm.activeCategoryIndex + addToIndex;
      if(newIndex > categoriesLength - 1) {
        newIndex = 0;
      } else if (newIndex < 0) {
        newIndex = categoriesLength - 1;
      }
      selectCategory(newIndex);
    }

    function scrollTop() {
      $ionicScrollDelegate.scrollTop(true);
    }
    function selectCategory(index) {
      vm.activeCategoryIndex = index;
      vm.activeCategory = vm.categories[index];
      vm.reloadImages = true;
      $ionicScrollDelegate.scrollTop(false);
    }

    function comment(image) {
      $state.go('nav.images-comment', { key : image.$id });
    }

    function currentVote(image) {
      if(vm.username) {
        return _.contains(image.votes, vm.username);
      }
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
          }, function (error) {
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

