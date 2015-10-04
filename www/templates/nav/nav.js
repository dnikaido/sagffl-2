(function () {
  'use strict';

  angular.module('sagffl')
    .controller('NavController', NavController);

  function NavController($state, Anchor, $ionicTabsDelegate) {
    var vm = this;
    var visibleTabs = ['nav.home', 'nav.programs', 'nav.images'];

    vm.$state = $state;
    vm.menuItems = Anchor.states;
    vm.tabItems = [];
    vm.selectTab = selectTab;

    activate();

    function activate() {
      vm.tabItems = Anchor.states.filter(isInVisibleTabs);
    }

    function isInVisibleTabs(item) {
      return 'state' in item && visibleTabs.indexOf(item.state) >= 0;
    }

    function selectTab(index) {
      $ionicTabsDelegate.$getByHandle('main').select(index);
      //Tabs wouldn't work if the same tab was selected while in a nested state
      if(index===2) $state.go('nav.programs');
    }

  }
})();
