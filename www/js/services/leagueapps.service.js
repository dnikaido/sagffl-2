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
      return makeRequest(requestUrl, storageKey)
        .then(function (programs) {
          return fixLocationUrl(programs);
        }, function(error) {
          return error;
        });

      function fixLocationUrl(programs) {
        return _.map(programs, function(program) {
          program.locationUrlHtml = program.locationUrlHtml.replace('locaion', 'location');
          return program;
        });
      }
    }

    function getSchedule(programId) {
      var requestUrl = url + 'programs/' + programId + '/schedule' + apiKey + callback,
        storageKey = 'schedule' + programId;
      return makeRequest(requestUrl, storageKey);
    }

    function makeRequest(requestUrl, storageKey) {
      var deferred;
      var data = $localStorage.hasOwnProperty(storageKey) === true
        ? $localStorage[storageKey]
        : null;
      if(data) {
        deferred = $q.defer();
        $log.debug('storage:' + requestUrl);
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
