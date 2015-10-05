(function () {
  'use strict';

  angular.module('sagffl')
    .controller('NavController', NavController);

  function NavController($state, Anchor, $ionicTabsDelegate) {
    var vm = this;

    vm.$state = $state;
    vm.menuItems = Anchor.states;
    vm.tabItems = Anchor.states.filter(isTab);
    vm.selectTab = selectTab;

    function isTab(item) {
      return item.tab===true;
    }

    function selectTab(index) {
      $state.go(vm.tabItems[index].state);
    }
  }
})();
