(function() {
  'use strict';

  angular.module('sagffl')
    .controller('CommentsController', CommentsController);

  function CommentsController($log, Gallery, $stateParams, Images, $facebook, $state, $ionicPopup, Util) {
    var comment = this;
    var commentError = 'Oops! Something happened trying to submit your comment. Please try again.';

    comment.image = {};
    comment.text = '';
    comment.username = null;
    comment.gallery = Gallery;
    comment.add = add;
    comment.login = login;
    comment.getFromNow = Util.getFromNow;

    activate();

    function activate() {
      $log.debug('activate');
      $facebook.getCurrentUser()
        .then(function(response) {
          comment.username = response.data.name;
        });
      comment.image = Images.getImage($stateParams.key);
    }

    function add() {
      if(comment.text) {
        Images.addComment(comment.image, comment.text, comment.username)
          .then(function() {
            comment.text = '';
          })
          .catch(function(error) {
            $log.debug(error);
            errorPopup(commentError);
          });
      }
    }

    function login() {
      var loginParams = {
        toState: 'nav.images.comment',
        options: {key: comment.image.$id}
      };
      $state.go('nav.login', loginParams)
    }

    function errorPopup(message) {
      $ionicPopup.alert({
        title: 'Couldn\'t submit...',
        template: message
      });
    }
  }


})();

