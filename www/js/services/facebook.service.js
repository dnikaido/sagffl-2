(function() {
  'use strict';

  angular.module('facebook', [
    'ngCordova',
    'ngStorage'
  ])
    .factory('$facebook', FacebookService);

  function FacebookService($log, $http, $cordovaOauth, $localStorage, $state) {
    var CLIENT_ID = '400628200140143';
    var url = 'https://graph.facebook.com/v2.4/';

    return {
      login : login,
      getAlbums : getAlbums
    };

    function login(toState, permissions) {
      var defaultPermissions = ['public_profile', 'user_photos'];
      permissions = permissions ? permissions : defaultPermissions;

      $cordovaOauth.facebook(CLIENT_ID, permissions)
        .then(function(response) {
          $localStorage.accessToken = response.access_token;
          $state.go(toState);
        })
        .catch(function(error) {
          $log.debug(error);
        });
    }

    function getAlbums(toState) {
      var albumUrl = url + 'me';
      var fields = 'albums{cover_photo,name,created_time}';

      if($localStorage.hasOwnProperty('accessToken') === true) {
        return $http.get(albumUrl + '?fields=' + encodeURIComponent(fields), {
          params: {
            access_token: $localStorage.accessToken
          }
        })
          .catch(function(error) {
            $log.debug(error);
          });
      } else {
        $state.go('/login', { toState : toState });
      }

    }
  }
})();
