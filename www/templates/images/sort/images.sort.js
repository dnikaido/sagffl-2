(function() {
  'use strict';

  angular.module('sagffl')
    .controller('ImagesSortController', ImagesSortController);

  function ImagesSortController($scope, $state, $timeout) {
    var sort = this;
    var ImagesController = $scope.$parent.vm;

    sort.orderDesc = null;
    sort.orderText = '';
    sort.selectedOrder = null;

    sort.selectOrder = selectOrder;
    sort.toggleOrderDesc = toggleOrderDesc;

    sort.orderTypes = [
      {
        name: 'Number of votes',
        func: countVotes
      },
      {
        name: 'Number of comments',
        func: countComments
      },
      {
        name: 'Upload time',
        func: getTimestamp
      }
    ];


    activate();

    function activate() {
      toggleOrderDesc(false);
      if(!ImagesController.orderSort) {
        sort.selectedOrder = sort.orderTypes[0];
      }
    }

    function count(property) {
      return property ? property.length : 0;
    }

    function countComments(image) {
      return count(image.comments);
    }

    function countVotes(image) {
      return count(image.votes);
    }

    function getTimestamp(image) {
      return image.timestamp;
    }

    function selectOrder(orderType) {
      ImagesController.orderSort = orderType.func;
      $state.go('nav.images.home');
      $timeout(function() {
        sort.selectedOrder = orderType;
      }, 100);
    }

    function toggleOrderDesc(value) {
      sort.orderDesc = value ? value : !sort.orderDesc;
      ImagesController.orderDesc = sort.orderDesc;
      if(sort.orderDesc) {
        sort.orderText = 'Most / Newest';
      } else {
        sort.orderText = 'Fewest / Oldest';
      }
    }
  }
})();

