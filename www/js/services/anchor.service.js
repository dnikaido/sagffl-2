(function() {
  'use strict';
  angular.module('sagffl')
    .service('Anchor', AnchorService);

  function AnchorService($rootScope, $facebook) {
    var service = this;
    var loginState = new State('nav.login', 'Log in', 'Home');
    var logoutState = new State('nav.logout', 'Log out', 'Home');
    service.states = [];

    $rootScope.$on('loggedIn', function() {
      loadLogoutState();
    });

    $rootScope.$on('logout', function() {
      loadLoginState();
    });

    loadStates();

    return service;

    function loadStates() {
      service.states.push(new State('nav.home', 'Home', 'Home', true));
      service.states.push(new State('nav.announcements', 'Announcements', 'Home'));
      service.states.push(new State('nav.images.home', 'Images', 'Images', true));
      service.states.push(new State('nav.programs', 'Programs', 'Programs', true));
      if($facebook.checkLogin()) {
        loadLogoutState();
      } else {
        loadLoginState();
      }
    }

    function loadLoginState() {
      service.states = _.without(service.states, logoutState);
      service.states.push(loginState);
    }

    function loadLogoutState() {
      service.states = _.without(service.states, loginState);
      service.states.push(logoutState);
    }

    function State(state, name, tab, isTab) {
      this.state = state;
      this.name = name;
      this.tab = tab;
      this.isTab = isTab;
    }
  }
})();
