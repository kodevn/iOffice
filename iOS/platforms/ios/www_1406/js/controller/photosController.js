'use strict';
angular.module('app').controller('photosController',function($scope, productService, $http) {

 $http.get(serverUrl + 'photos?projectid=' + productService.CustomerId).success(
  function(data, status, headers, config) {

    $scope.photos = data;

    for (var i = 0; i < $scope.photos.length; i++) {


      $scope.photos[i].IncludeModel = photoSever + "/thumbnails/" + $scope.photos[i].FileName + ".jpg";
      $scope.photos[i].FileName = photoSever + "/attachments/" + $scope.photos[i].FileName + $scope.photos[i].FileExtension;

    }

  }).error(function(data, status, headers, config) {

   console.log(data);
 });

});

function openImage(source){
 
   spinnerplugin.show({
    overlay: false,    // defaults to true
    timeout: 10,       // defaults to 0 (no timeout)
    fullscreen: true,  // defaults to false
});
 var open = cordova.plugins.disusered.open;

 function success() {
   console.log('Success');
   spinnerplugin.hide();
 }

 function error(code) {
   spinnerplugin.hide();
   if (code === 1) {
     console.log('No file handler found');
   }
   else {
     console.log('Undefined error');
   }
 }

 open(source, success, error);
}
