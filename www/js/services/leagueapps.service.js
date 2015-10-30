(function() {
  'use strict';
  angular.module('sagffl')
    .factory('$leagueapps', LeagueAppsService);

  LeagueAppsService.$inject = ['$http', 'Config', '$localStorage', '$q', '$log'];
  function LeagueAppsService($http, Config, $localStorage, $q, $log) {
    var apiKey = '?x-api-key=' + Config.LEAGUEAPPS_API_KEY;
    var url = 'http://api.leagueapps.com/v1/sites/' + Config.LEAGUEAPPS_ID + '/';
    var callback = '&callback=JSON_CALLBACK';

    return {
      getAnnouncements: getAnnouncements,
      getPrograms: getPrograms,
      getSchedule: getSchedule,
      getStandingsSrc: getStandingsSrc
    };

    function getAnnouncements() {
      var requestUrl = url + 'announcements' + apiKey + callback,
          storageKey = 'announcements';
      return makeRequest(requestUrl, storageKey);
    }

    function getPrograms() {
      var requestUrl = url + 'programs/current' + apiKey + callback,
        storageKey = 'programs';
      return makeRequest(requestUrl, storageKey);
    }

    function getSchedule(programId) {
      var requestUrl = url + 'programs/' + programId + '/schedule' + apiKey + callback,
        storageKey = 'schedule' + programId;
      return makeRequest(requestUrl, storageKey);
    }

    function makeRequest(requestUrl, storageKey) {
      var data = $localStorage.hasOwnProperty(storageKey) === true
        ? $localStorage[storageKey]
        : null;
      if(data) {
        $log.debug('storage:' + requestUrl);
        var deferred = $q.defer();
        deferred.resolve(data);
        return deferred.promise;
      } else {
        $log.debug('requesting: ' + requestUrl);
        return $http.jsonp(requestUrl)
          .then(function(response) {
            $localStorage[storageKey] = response.data;
            return response.data;
          });
      }
    }

    function getStandingsSrc(programId) {
      return 'http://sagffl.leagueapps.com/widgets/standingsContent?lid=' + programId;
    }
  }
})();
