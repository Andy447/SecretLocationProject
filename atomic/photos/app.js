'use strict';

angular.module("secretkeyapp")
  .controller('MainCtrl', function ($scope, $http, Personservice) {
    $scope.hashTags = [];
/******************************
    Initialize Facebook SDK
*******************************/
    //App ID
    var fbID = 675427939218868;

    window.fbAsyncInit = function() {
      FB.init({
        appId      : fbID,
        xfbml      : true,
        version    : 'v2.0'
      });

    };

    var getAlbum = function(){
      //Flag for when we add new pic
      var addedNew = false;

      console.log('getting Album');
		FB.api(
			"/10152643970325120/photos",
			function (photos) {
			  /*
			  FB api returns JSON array of photos
			  Loop through array, adding new photos
			  to DB. Compares picture URL's to avoid
			  duplicates'
			  */
			  for(var photo in photos["data"]){
				  var found = false;
				  for(var f in $scope.slides){
				    if($scope.slides[f].picURL === photos["data"][photo].source){
				      found = true;
				    }
				  }
				if(!found){
				  addFolk(photos["data"][photo]);
				  addedNew = true;
				}
			  }
			}
		);
      if(addedNew){
        folkPromise();
      }
      getTags();
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));



