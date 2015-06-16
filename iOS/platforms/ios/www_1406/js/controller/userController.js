'use strict';
angular.module('app').controller('userController',function($scope, productService, $http) {

 $scope.tabbar.setTabbarVisibility(true);


 
 $http.get(serverUrl + 'danhsachnhanvien?userId=' + JSON.parse(window.sessionStorage.userSessionInfo).userId).success(
  function(data, status, headers, config) {
      spinnerplugin.show({
    overlay: false,    // defaults to true
    timeout: 10,       // defaults to 0 (no timeout)
    fullscreen: true,  // defaults to false
});
    for(var i = 0; i < data.length;i++){
      if (data[i].Picture == null || data[i].Picture == '') {
        data[i].Picture = 'img/avatar.jpg';
      }
    }

    $scope.listUsers = data;
    spinnerplugin.hide();
  }).error(function(data, status, headers, config) {
    console.log(data);
  });

  $scope.detailUser = function(user) {
    productService.userSelectDetail = user;
    //$scope.ons.navigator.pushPage('user_detail.html');
    userNavigator.pushPage('user_detail.html');
  }
});
