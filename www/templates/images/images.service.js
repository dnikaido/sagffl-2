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
      getImagesPromise : getImagesPromise,
      toggleVote : toggleVote
    };

    function addComment(image, text, username) {
      var comment = {
        text : text,
        username : username,
        timestamp :  Firebase.ServerValue.TIMESTAMP
      };
      if(image.hasOwnProperty('comments')===false) {
        image.comments = [comment];
      } else {
        image.comments.push(comment);
      }
      return imageFire.$save(image);
    }

    function getImagesPromise() {
      return imageFire.$loaded();
    }

    function getImages() {
      return imageFire;
    }

    function addImage(image) {
      image.timestamp = Firebase.ServerValue.TIMESTAMP;
      return imageFire.$add(image);
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
