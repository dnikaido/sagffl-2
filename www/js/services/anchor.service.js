(function() {
  'use strict';
  angular.module('sagffl')
    .service('Anchor', AnchorService);

  function AnchorService() {
    var service = this;
    service.states = [];

    loadStates();

    function loadStates() {
      service.states.push(new State('nav.home', 'Home', true));
      service.states.push(new State('nav.announcements', 'Announcements'));
      service.states.push(new State('nav.images', 'Images', true));
      service.states.push(new State('nav.programs', 'Programs', true));
    }

    function State(state, name, tab) {
      this.state = state;
      this.name = name;
      this.tab = tab;
    }
  }
})();
