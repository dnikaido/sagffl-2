(function () {
  'use strict';

  angular.module('sagffl')
    .factory('Images', ImagesService);

  function ImagesService($firebaseArray, $rootScope) {
    var firebaseUrl = 'https://glowing-torch-8356.firebaseio.com/';
    var categoriesRef = new Firebase(firebaseUrl + 'categories');
    var categories = $firebaseArray(categoriesRef);
    var imageArrays = {};
    var categoriesLoaded = false;
    var imageArraysLoaded = false;
    var imageCategoryXref = {};

    setImageArrays();

    return {
      addComment : addComment,
      addImage : addImage,
      getCategory : getCategory,
      getCategories : getCategories,
      getImage : getImage,
      getImages : getImages,
      getTopImages : getTopImages,
      toggleVote : toggleVote
    };

    function setImageArrays() {
      getCategories()
        .then(function(categories) {
          var tempScope = $rootScope.$new(true);
          tempScope.loadedCounter = 0;
          _.each(categories, function(category) {
            var imageRef = new Firebase(firebaseUrl + 'categories/' + category.$id + '/images');
            var imageArray = $firebaseArray(imageRef);
            imageArrays[category.$id] = imageArray;
            imageArray.$loaded()
              .then(function(images) {
                _.each(images, function(image) {
                  imageCategoryXref[image.$id] = category.$id;
                });
                tempScope.loadedCounter++;
              });
          });
          categoriesLoaded = true;

          var loadedCounterWatch = tempScope.$watch('loadedCounter',
            function(newVal) {
              if(newVal === categories.length) {
                imageArraysLoaded = true;
                $rootScope.$broadcast('imageArraysLoaded');
                loadedCounterWatch();
              }
            });
        });
    }

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
      return saveImage(image);
    }

    function addImage(image, categoryIndex) {
      image.timestamp = Firebase.ServerValue.TIMESTAMP;
      var category = getCategory(categoryIndex);
      var imageArray = imageArrays[category.$id];
      return imageArray.$add(image)
        .then(function(imageRef) {
          imageCategoryXref[imageRef.key()] = category.$id;
          return imageRef;
        });
    }

    function getCategory(categoryIndex) {
      return categories.$getRecord(getCategoryId(categoryIndex));
    }

    function getCategories() {
      return categories.$loaded();
    }

    function getCategoryId(categoryIndex) {
      return categories.$keyAt(categoryIndex);
    }

    function getImage(imageKey) {
      var imageArray = imageArrays[imageCategoryXref[imageKey]];
      return imageArray.$getRecord(imageKey);
    }

    function getImages(categoryKey) {
      if(categoriesLoaded) {
        return imageArrays[categoryKey].$loaded();
      } else {
        return $q.reject('image arrays not loaded');
      }
    }

    function getTopImages() {
      if(categoriesLoaded) {
        var topImages = _.values(_.mapObject(imageArrays, function(images) {
          return _.max(images, function(image) {
            return image.votes ? image.votes.length : 0;
          })
        }));
        return topImages;
      }
      return null;
    }

    function saveImage(image) {
      var imageArray = imageArrays[imageCategoryXref[image.$id]];
      return imageArray.$save(image);
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
      return saveImage(image);
    }
  }
})();
