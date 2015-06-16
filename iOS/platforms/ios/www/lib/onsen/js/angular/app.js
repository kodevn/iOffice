var app=angular.module('single-page-app',['ngRoute']);
app.config(function($routeProvider){
      $routeProvider
          .when('/',{
                templateUrl: 'index.html'
          })
          .when('/homepage',{
                templateUrl: 'partials/project.html'
          })
          .when('/detail',{
                templateUrl: 'partials/detail.html'
          })
          ;
});
app.controller('cfgController',function($scope){

    /*      
    Here you can handle controller for specific route as well.
    */
});