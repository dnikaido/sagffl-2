(function () {
  'use strict';

  angular.module('sagffl')
    .controller('NavController', NavController);

  function NavController($state, Anchor) {
    var vm = this;
    var visibleTabs = ['nav.announcements', 'nav.images'];

    vm.$state = $state;
    vm.menuItems = Anchor.states;
    vm.tabItems = [];

    activate();

    function activate() {
      vm.tabItems = Anchor.states.filter(isInVisibleTabs);
    }

    function isInVisibleTabs(item) {
      return 'state' in item && visibleTabs.indexOf(item.state) >= 0;
    }

  }
})();
