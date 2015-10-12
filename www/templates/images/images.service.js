(function () {
  'use strict';

  angular.module('sagffl')
    .factory('Images', ImagesService);

  function ImagesService($firebaseArray) {
    var imageRef = new Firebase('https://glowing-torch-8356.firebaseio.com/images'),
        imageFire = $firebaseArray(imageRef);

    return {
      addComment : addComment,
      addImage : addImage,
      getImages : getImages,
      toggleVote : toggleVote
    };

    function addComment(image, text, username) {
      var comment = {
        text : text,
        username : username
      };
      if(image.hasOwnProperty('comments')===false) {
        image.comments = [comment];
      } else {
        image.comments.push(comment);
      }
      imageFire.$save(image);
    }

    function getImages() {
      return imageFire.$loaded();
    }

    function addImage(image) {
      imageFire.$add(image);
    }

    function toggleVote(image, username) {
      if(image.hasOwnProperty('votes')===false) {
        image.votes = [username];
      } else {
        if(_.contains(image.votes, username)) {
          //image.votes = _.without(image.votes, username);
          image.votes.push(username);

        } else {
          image.votes.push(username);
        }
      }
      imageFire.$save(image);
    }
  }
})();
