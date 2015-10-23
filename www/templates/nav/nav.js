(function () {
  'use strict';

  angular.module('sagffl')
    .controller('NavController', NavController);

  function NavController($state, Anchor, $ionicSideMenuDelegate, $ionicTabsDelegate, $timeout) {
    var vm = this;

    vm.$state = $state;
    vm.menuItems = Anchor.states;
    vm.tabItems = Anchor.states.filter(isTab);
    vm.selectTab = selectTab;

    activate();

    function activate() {
      $timeout(function() {
        $ionicSideMenuDelegate.$getByHandle('side').canDragContent(false);
        $ionicTabsDelegate.$getByHandle('main').select(0);
      }, 0);
    }

    function isTab(item) {
      return item.tab===true;
    }

    function selectTab(index) {
      var tabs = $ionicTabsDelegate.$getByHandle('main');
      if(tabs.selectedIndex() !== index) {
        tabs.select(index);
      }
      $state.go(vm.tabItems[index].state);
    }
  }
})();
