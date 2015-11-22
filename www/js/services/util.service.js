(function() {
  'use strict';
  angular.module('sagffl')
    .service('Util', UtilService);

  function UtilService() {
    return {
      getFromNow: getFromNow
    };

    function getFromNow(timestamp) {
      if(timestamp) {
        var commentTime = moment(timestamp);
        return commentTime.fromNow();
      } else {
        return '';
      }
    }

  }
})();
