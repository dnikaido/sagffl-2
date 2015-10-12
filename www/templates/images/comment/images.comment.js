(function() {
  'use strict';

  angular.module('sagffl')
    .directive('imageComments', imageComments)
    .controller('CommentsController', CommentsController);

  function imageComments() {
    return {
      templateUrl : 'templates/images/comment/images.comment.html',
      scope : {
        image : '=',
        username : '='
      },
      controller : 'CommentsController as comment'
    };
  }

  function CommentsController(Gallery, imagesResolve, $stateParams, Images, $facebook, $state) {
    var comment = this;

    comment.image = {};
    comment.gallery = Gallery;
    comment.text = '';
    comment.add = add;
    comment.login = login;
    comment.username = null;

    activate();

    function activate() {
      $facebook.getCurrentUser()
        .then(function(response) {
          comment.username = response.data.name;
        });
      comment.image = imagesResolve.$getRecord($stateParams.key);
    }

    function add() {
      Images.addComment(comment.image, comment.text, comment.username);
    }

    function login() {
      var loginParams = {
        toState: 'nav.images-comment',
        options: {key: comment.image.$id}
      };
      $state.go('nav.login', loginParams)
    }
  }


})();

