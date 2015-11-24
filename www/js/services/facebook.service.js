(function() {
  'use strict';

  angular.module('myFacebook', [
    'ngCordova',
    'ngStorage',
    'ezfb',
    'ionic'
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
    var permission = {
      PUBLIC : 'public_profile',
      PHOTOS : 'user_photos'
    };

    return {
      permission : permission,
      login : login,
      loginRerequest : loginRerequest,
      getAlbums : getAlbums,
      getAlbumPhotos : getAlbumPhotos,
      getPhoto : getPhoto,
      getCurrentUser : getCurrentUser
    };


    function loginRerequest(toState, params, permissions) {
      return login(toState, params, permissions, true);
    }

    function login(toState, params, permissions, rerequest) {
      var defaultPermissions = permission.PUBLIC;
      permissions = permissions
        ? defaultPermissions + ',' + permissions
        : defaultPermissions;

      var requestParams = {
        return_scopes: true
      };
      if(rerequest) {
        requestParams.auth_type = 'rerequest';
      }

      return $cordovaOauth.facebook(CLIENT_ID, permissions.split(','), requestParams)
        .then(function(response) {
          return loginSuccess(response);
        }, function(error) {
          if(error==='Facebook returned error_code=100: Invalid permissions') {
            return $q.reject('Invalid permissions');
          } else if(error==='Cannot authenticate via a web browser') {
            /* Only for running in a browser! */
            return browserLogin();
          } else {
            return $q.reject(error);
          }
        });

      function verifyPermissions(response) {
        $localStorage.permissions = response.data.data;
        if(checkPermissions(permissions.split(','))) {
          $state.go(toState, params, { reload : true });
          return $q.resolve();
        } else {
          return $q.reject('Permission denied');
        }
      }

      function loginSuccess(response) {
        $localStorage.accessToken = response.access_token;
        getCurrentUser();
        return getPermissions()
          .then(verifyPermissions)
          .catch(function(error) {
            return $q.reject(error);
          });
      }
      function browserLogin() {
        requestParams.scope = permissions;
        return ezfb.login(null, requestParams)
          .then(function(response) {
            $localStorage.accessToken = response.authResponse.accessToken;
            getCurrentUser();
            return getPermissions()
              .then(verifyPermissions)
              .catch(function(error) {
                return $q.reject(error);
              });
          }, function(error) {
            return $q.reject(error);
          });
      }
    }

    function getCurrentUser(toState, forceLogin) {
      if(checkLogin()) {
        if($localStorage.hasOwnProperty('username')===true) {
          var response = {
            data : { name : $localStorage.username }
          };
          return $q.resolve(response);
        }
        var userUrl = url + 'me';
        return $http.get(userUrl, {
          params: {
            access_token : $localStorage.accessToken
          }
        })
          .then(function(response) {
            $localStorage.username = response.data.name;
            return response;
          });
      } else if(toState && forceLogin) {
        $state.go('nav.login', {
          toState: toState
        });
      }
      return $q.reject('not logged in');
    }

    function getPermissions() {
      var permissionsUrl = url + 'me/permissions';

      return $http.get(permissionsUrl, {
        params: {
          access_token : $localStorage.accessToken
        }
      });
    }

    function getAlbums(toState, options) {
      var albumUrl = url + 'me';
      var fields = 'albums{picture,name,created_time}';

      if(checkLogin() && checkPermissions([permission.PHOTOS])) {
        return $http.get(albumUrl + '?fields=' + encodeURIComponent(fields), {
          params: {
            access_token : $localStorage.accessToken
          }
        });
      } else {
        $state.go('nav.login', {
          toState : toState,
          options : options,
          permissions : [permission.PHOTOS]
        });
        return $q.reject('not logged in');
      }
    }

    function getAlbumPhotos(albumId, toState) {
      var albumUrl = url + albumId;
      var fields = 'photos{picture}';

      if(checkLogin() && checkPermissions([permission.PHOTOS])) {
        return $http.get(albumUrl + '?fields=' + encodeURIComponent(fields), {
          params: {
            access_token : $localStorage.accessToken
          }
        });
      } else {
        $state.go('nav.login', {
          toState : toState,
          permissions : [permission.PHOTOS]
        });
        return $q.reject('not logged in');
      }
    }

    function getPhoto(photoId, toState) {
      var photoUrl = url + photoId;
      var fields = 'images';

      if(checkLogin() && checkPermissions([permission.PHOTOS])) {
        return $http.get(photoUrl + '?fields=' + encodeURIComponent(fields), {
          params: {
            access_token : $localStorage.accessToken
          }
        });
      } else {
        $state.go('nav.login', {
          toState : toState,
          permissions : [permission.PHOTOS]
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
