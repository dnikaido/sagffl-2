(function() {
  'use strict';
  angular.module('sagffl')
    .factory('$leagueapps', LeagueAppsService);

  LeagueAppsService.$inject = ['$http', 'Config'];
  function LeagueAppsService($http, Config) {
    var apiKey = '?x-api-key=' + Config.LEAGUEAPPS_API_KEY;
    var url = 'http://api.leagueapps.com/v1/sites/' + Config.LEAGUEAPPS_ID + '/';
    var callback = '&callback=JSON_CALLBACK';

    return {
      getAnnouncements: getAnnouncements,
      getPrograms: getPrograms,
      getSchedule: getSchedule
    };

    function getAnnouncements() {
      return $http.jsonp(url + 'announcements'
        + apiKey + callback);
    }

    function getPrograms() {
      return $http.jsonp(url + 'programs/current'
        + apiKey + callback);
    }

    function getSchedule(programId) {
      return $http.jsonp(url + 'programs/' + programId + '/schedule'
        + apiKey + callback);
    }
  }
})();
