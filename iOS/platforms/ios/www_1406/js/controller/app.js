'use strict';

//var serverUrl = 'http://wehelloworld.com/tarch/services/';
var serverUrl = 'http://rims.noip.me:7779/ioffice/services/';
//var serverUrl = 'http://172.16.123.71/dev-phonegap2/services/';
var photoSever = 'http://rims.noip.me:7776';


console.log("=================Start==============");

document.addEventListener("deviceready", onDeviceReady, true);
document.addEventListener("resume", function() {

  // window.location.reload(true);
});

function onDeviceReady() {
  console.log("===DEVIDE READY===");
  var db = window.sqlitePlugin.openDatabase({
    name: "tarch_app.db",
    location: 1
  });

  //create table if not exists
  db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS user (userId INTEGER, email TEXT, avatar TEXT, username TEXT, bg TEXT )');
    tx.executeSql("create table if not exists feedback (localId integer primary key autoincrement, customerId integer, userId interger,serverId interger, content text, feedbackdate interger, username text, email text, picture text, type text);", [], function(tx, resultcheck) {
      console.log("created feedback table");
    });

    tx.executeSql('create table if not exists project (customerId integer primary key, userId interger, projectName text, feedback text, countNew integer);');
    console.log("===CREATE TABLE project===");
  });


  // Select from data have userId or not
  db.transaction(getUserLoginId);
  checkPush();
}


angular.module('app', [
  'onsen',
  'app.projectService',
  'app.detailService',
  'app.userService'
  ]); 





var headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

angular.module('app')
.service('productService', function() {

  var dataList = [];

  var dataDetailProject = function(newObj) {

    dataList.push(newObj);
  }

  var dataUserSetting = function(newObj) {

    dataList.push(newObj);
  }

  var dataListProject = function(newObj) {

    dataList.push(newObj);
  }

  var flagListProject = function(newObj) {

    dataList.push(newObj);
  }

  var saleDataProject = function(newObj) {

    dataList.push(newObj);
  }

  var userSelectDetail = function(newObj) {

    dataList.push(newObj);
  }

  var detailPaging = function(newObj) {

    dataList.push(newObj);
  }

  return {
    dataDetailProject: dataDetailProject,
    dataUserSetting: dataUserSetting,
    dataListProject: dataListProject,
    flagListProject: flagListProject,
    saleDataProject: saleDataProject,
    userSelectDetail: userSelectDetail,
    detailPaging: detailPaging
  };

})


;



// Select data
function getUserLoginId(tx) {
  console.log("=====+START CHECK");
  tx.executeSql(
    'SELECT * FROM user', [],
    function(tx, results) {
      var len = results.rows.length;
      console.log("user count: "+len);
      if (len > 0) {
        window.sessionStorage.setItem("userSessionInfo",JSON.stringify(results.rows.item(0)));
        console.log("userId current: "+JSON.parse(window.sessionStorage.userSessionInfo).userId);
        var valueUserId = JSON.parse(window.sessionStorage.userSessionInfo).userId;
          //  $scope.dataUserSetting = results[0];
          if (valueUserId > 0) {
            console.log("=====+START go to project");
            myNavigator.pushPage('project.html');
          }else{
            console.log("=====+START go to login");
            myNavigator.pushPage('login.html');
          }
        }else{
          console.log("=====+START go to login");
          myNavigator.pushPage('login.html');
        }
      }
      );
}

function imgError(image) {
  image.onerror = "";
  image.src = "img/avatar.jpg";
  return true;
}
function imgProjectError(image) {
  image.onerror = "";
  image.src = "img/group.png";
  return true;
}


