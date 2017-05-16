/* Codes for linking to Laravel Backend API for database information */
var host="http://localhost:8000";
var id_token = localStorage.getItem('id_token');

var lock = new Auth0Lock('RqjZYWY4zj68fE272VbcqASBTnbbHU2k', 'pamelalim.auth0.com', {
  gravatar: true,
  auth: { 
    params: { 
      scope: 'openid name email picture' 
    }
  }
});

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
  if (id_token) {
      $http({
        method: 'GET',
        url: host,
        headers:{
          'Authorization':'Bearer '+ id_token
        }
      }).then(function successCallback(response) {
          if (response.data.user) $scope.user = response.data.user;
          $scope.mybooks = response.data.mybooks;
          $scope.books = response.data.books;
        }, function errorCallback(response) {
          alert("Your internet connection is not working to use this app." + response.statusText);
        });    
  }
  lock.on("authenticated", function(authResult) {
    lock.getProfile(authResult.idToken, function(error, profile) {
      if (error) {
        alert('Error in getting user profile' + error);
        return;
      }

      localStorage.setItem('id_token', authResult.idToken);
      id_token = authResult.idToken;
      // Display user information
      $('.nickname').text(profile.firstname);
      $http({
        method: 'GET',
        url: host,
        headers:{
          'Authorization':'Bearer '+ id_token
        }
      }).then(function successCallback(response) {
          if (response.data.user) $scope.user = response.data.user;
          $scope.mybooks = response.data.mybooks;
          $scope.books = response.data.books;
          console.log($scope.mybooks);
        }, function errorCallback(response) {
          });
      });
  });

    $scope.error = "Please key in all the fields and then click submit.";
    $scope.createbook = function () {
    // Posting data to backend
  
          $http({
          method  : 'POST',
          url     : host + '/books/create',
          data    : {'title':$scope.title, 'cover':$scope.cover, 'synopsis':$scope.synopsis}, //forms user object
          headers : {'Authorization':'Bearer '+ id_token} 
         })
          .then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
          };
        });

/* Codes for linking to Auth0 for authentication */

function login(){
  lock.show();  
}

function logout() {
  alert('Logout!');
  localStorage.removeItem('id_token');
  window.location.href = "/";
}
