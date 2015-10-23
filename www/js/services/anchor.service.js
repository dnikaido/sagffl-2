(function() {
  'use strict';
  angular.module('sagffl')
    .service('Anchor', AnchorService);

  function AnchorService() {
    var service = this;
    service.states = [];

    loadStates();

    function loadStates() {
      service.states.push(new State('nav.home', 'Home', 'Home', true));
      service.states.push(new State('nav.announcements', 'Announcements', 'Home'));
      service.states.push(new State('nav.images', 'Images', 'Images', true));
      service.states.push(new State('nav.programs', 'Programs', 'Programs', true));
      service.states.push(new State('nav.login', 'Login', 'Home'));
    }

    function State(state, name, tab, isTab) {
      this.state = state;
      this.name = name;
      this.tab = tab;
      this.isTab = isTab;
    }
  }
})();
