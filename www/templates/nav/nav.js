(function () {
  'use strict';

  angular.module('sagffl')
    .controller('NavController', NavController);

  function NavController($scope, $state, Anchor, $ionicSideMenuDelegate, $ionicTabsDelegate, $ionicHistory, $timeout) {
    var vm = this;

    vm.$state = $state;
    vm.menuItems = Anchor.states;
    vm.tabs = {};
    vm.tabItems = Anchor.states.filter(isTab);

    vm.goBack = goBack;
    vm.selectMenuItem = selectMenuItem;
    vm.selectTab = selectTab;

    $scope.$watch(function() {
      return Anchor.states;
    }, function(newStates) {
      vm.menuItems = newStates;
    });

    activate();

    function activate() {
      $timeout(function() {
        $ionicSideMenuDelegate.$getByHandle('side').canDragContent(false);
        vm.tabs = $ionicTabsDelegate.$getByHandle('main');
        vm.tabs.select(0);
      }, 0);
    }

    function goBack() {
      var backView = $ionicHistory.backView();
      var backViewIndex = backView.index;
      var backCount = 0;
      var historyStack = $ionicHistory.viewHistory()
        .histories[backView.historyId].stack;
      var parentItem = undefined;
      var oldView;
      while(backViewIndex >= 0 && parentItem === undefined) {
        oldView = historyStack[backViewIndex--];
        parentItem = _.findWhere(vm.menuItems, { name : oldView.title });
        backCount--;
      }
      if(parentItem === undefined) {
        checkTab(0);
        $state.go('nav.home');
      } else {
        var index = _.findIndex(vm.tabItems, function(tabItem) {
          return tabItem.name === parentItem.tab;
        });
        checkTab(index);
        $ionicHistory.goBack(backCount);
      }
    }

    function isTab(item) {
      return item.isTab===true;
    }

    function selectMenuItem(menuItem) {
      var index = _.findIndex(vm.tabItems, function(tabItem) {
        return tabItem.name === menuItem.tab;
      });

      checkTab(index);
      $state.go(menuItem.state);
    }

    function selectTab(index) {
      checkTab(index);
      $state.go(vm.tabItems[index].state);
    }

    function checkTab(index) {
      if(vm.tabs.selectedIndex() !== index) {
        vm.tabs.select(index);
      }
    }
  }
})();
