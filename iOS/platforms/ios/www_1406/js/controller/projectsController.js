'use strict';

/*
* Set project information to productService.dataDetailProject
*/
angular.module('app').controller(
  'listProjectController',
  function($scope, productService, $http,Project,User) {

  // Set paging to default
  productService.detailPaging = 0;

  $scope.tabbar.setTabbarVisibility(true);
    // if (productService.flagListProject) {
    spinnerplugin.show({
    overlay: false,    // defaults to true
    timeout: 10,       // defaults to 0 (no timeout)
    fullscreen: true,  // defaults to false
});
    // Set data to scope
    //Project.insertAllProject(JSON.parse(window.sessionStorage.userSessionInfo).userId);
    // $scope.projects = {};
    // productService.dataListProject = {};
  //  var scope = angular.element(document.getElementById("idlistProjectController")).scope();
  //  var projectReturn=Project.getListProject(JSON.parse(window.sessionStorage.userSessionInfo).userId);
    // setTimeout(function() {
    //   console.log("waiting 0.1 seconds");
    //     scope.$apply(function() {
    //       $scope.projects = projectReturn;
    //       console.log("length of controller "+$scope.projects.length);
    //       $scope.flagListProject = false;
    //
    //     });
    //     spinnerplugin.hide();
    // }, 1000); // 2 seconds
    $http.get(serverUrl + 'topProjects?q=' +JSON.parse(window.sessionStorage.userSessionInfo).userId).success(
      function(data, status, headers, config) {
        $scope.projects=data;
          $scope.photoServer=photoSever+"/attachments/projects/";
        spinnerplugin.hide();
      }).error(function(data, status, headers, config) {
        spinnerplugin.hide();
        console.log(data);
      });

    
    $scope.dataUserSetting=JSON.parse(window.sessionStorage.userSessionInfo);



    $scope.reloadPage = function() {
      // idlistProjectController
      spinnerplugin.show({
    overlay: false,    // defaults to true
    timeout: 10,       // defaults to 0 (no timeout)
    fullscreen: true,  // defaults to false
});
      $http.get(serverUrl + 'topProjects?q=' +JSON.parse(window.sessionStorage.userSessionInfo).userId).success(
        function(data, status, headers, config) {
          $scope.projects=data;
          spinnerplugin.hide();
        }).error(function(data, status, headers, config) {
          spinnerplugin.hide();
          console.log(data);
        });
    }

    $scope.getallProject = function() {
      // idlistProjectController
      spinnerplugin.show({
    overlay: false,    // defaults to true
    timeout: 10,       // defaults to 0 (no timeout)
    fullscreen: true,  // defaults to false
});
      $http.get(serverUrl + 'projects?q=' +JSON.parse(window.sessionStorage.userSessionInfo).userId).success(
        function(data, status, headers, config) {
          $scope.projects=data;
          spinnerplugin.hide();
        }).error(function(data, status, headers, config) {
          spinnerplugin.hide();
          console.log(data);
        });
    }
    $scope.detailProject = function(data) {
        spinnerplugin.show({
    overlay: false,    // defaults to true
    timeout: 10,       // defaults to 0 (no timeout)
    fullscreen: true,  // defaults to false
});
      productService.dataDetailProject = data;
      $scope.projects = {};
      productService.dataListProject = {};
      console.log("goto detail: "+data.CustomerId);
      $scope.ons.navigator.pushPage('detail.html');
      spinnerplugin.hide();
    }

    $scope.scrolling= function(data) {
      console.log("goto scrolling: ");
    }

  });
