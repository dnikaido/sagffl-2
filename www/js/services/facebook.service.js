(function() {
  'use strict';

  angular.module('myFacebook', [
    'ngCordova',
    'ngStorage',
    'ezfb'
  ])
    .factory('$facebook', FacebookService)
    .config(function(ezfbProvider) {
      ezfbProvider.setInitParams({
        appId: '400628200140143'
      });
    });

  function FacebookService($log, $http, $cordovaOauth, $localStorage, $state, ezfb, $q) {
    var CLIENT_ID = '400628200140143';
    var url = 'https://graph.facebook.com/v2.4/';

    return {
      login : login,
      getAlbums : getAlbums,
      getAlbumPhotos : getAlbumPhotos,
      getPhoto : getPhoto
    };

    function login(toState, permissions) {
      var defaultPermissions = 'public_profile';
      permissions = permissions
        ? defaultPermissions + ',' + permissions
        : defaultPermissions;

      $cordovaOauth.facebook(CLIENT_ID, permissions.split(','), { return_scopes: true })
        .then(function(response) {
          $localStorage.accessToken = response.access_token;
          getPermissions()
            .then(permissionCallback)
            .catch(function(error) {
              $log.debug(error);
            });
        })
        .catch(function(error) {
          /* Only for running in a browser! */
          if(error==='Cannot authenticate via a web browser') {
            ezfb.login(null, { scope: permissions })
              .then(function(response) {
                $localStorage.accessToken = response.authResponse.accessToken;
                getPermissions()
                  .then(permissionCallback)
                  .catch(function(error) {
                    $log.debug(error);
                  });
              });
          } else {
            $log.debug(error);
          }
        });
      function permissionCallback(response) {
        $localStorage.permissions = response.data.data;
        $state.go(toState, {}, {
          reload : true
        });
      }
    }

    function getPermissions() {
      var permissionsUrl = url + 'me/permissions';

      return $http.get(permissionsUrl, {
        params: {
          access_token : $localStorage.accessToken
        }
      });
    }

    function getAlbums(toState) {
      var albumUrl = url + 'me';
      var fields = 'albums{picture,name,created_time},name';

      if(checkLogin() && checkPermissions(['user_photos'])) {
        return $http.get(albumUrl + '?fields=' + encodeURIComponent(fields), {
          params: {
            access_token : $localStorage.accessToken
          }
        });
      } else {
        $state.go('nav.login', {
          toState : toState,
          permissions : 'user_photos'
        });
        return $q.reject('not logged in');
      }
    }

    function getAlbumPhotos(albumId, toState) {
      var albumUrl = url + albumId;
      var fields = 'photos{picture}';

      if(checkLogin() && checkPermissions(['user_photos'])) {
        return $http.get(albumUrl + '?fields=' + encodeURIComponent(fields), {
          params: {
            access_token : $localStorage.accessToken
          }
        });
      } else {
        $state.go('nav.login', {
          toState : toState,
          permissions : 'user_photos'
        });
        return $q.reject('not logged in');
      }
    }

    function getPhoto(photoId, toState) {
      var photoUrl = url + photoId;
      var fields = 'images';

      if(checkLogin() && checkPermissions(['user_photos'])) {
        return $http.get(photoUrl + '?fields=' + encodeURIComponent(fields), {
          params: {
            access_token : $localStorage.accessToken
          }
        });
      } else {
        $state.go('nav.login', {
          toState : toState,
          permissions : 'user_photos'
        });
        return $q.reject('not logged in');
      }
    }

    function checkLogin() {
      return $localStorage.hasOwnProperty('accessToken') === true;
    }

    function checkPermissions(permissions) {
      if($localStorage.hasOwnProperty('permissions') === true) {
        var grantedPermissions =
          $localStorage.permissions.filter(function(permission) {
            return permissions.indexOf(permission.permission) >= 0
              && permission.status === 'granted';
          });
        return grantedPermissions.length === permissions.length;
      } else {
        return false;
      }
    }
  }
})();
