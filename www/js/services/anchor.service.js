(function() {
  'use strict';
  angular.module('sagffl')
    .service('Anchor', AnchorService);

  function AnchorService() {
    var service = this;
    service.states = [];

    loadStates();

    function loadStates() {
      service.states.push(new State('nav.home', 'Home'));
      service.states.push(new State('nav.announcements', 'Announcements'));
      service.states.push(new State('nav.images', 'Images'));
      service.states.push(new State('nav.programs', 'Programs'));
    }

    function State(state, name) {
      this.state = state;
      this.name = name;
    }
  }
})();
