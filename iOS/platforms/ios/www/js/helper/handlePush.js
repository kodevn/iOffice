'use strict';
//handle push
function checkPush(){
  try {
    var pushNotification = window.plugins.pushNotification;
    if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos') {
      pushNotification.register(successHandler, errorHandler, {
        "senderID": "759020390967",
        "ecb": "onNotification"
      }); // required!
    } else {
      pushNotification.register(tokenHandler, errorHandler, {
        "badge": "true",
        "sound": "true",
        "alert": "true",
        "ecb": "onNotificationAPN"
      }); // required!
    }
  } catch (err) {
    var txt = "There was an error on this page.\n\n";
    txt += "Error description: " + err.message + "\n\n";
    alert(txt);
  }

};


// handle APNS notifications for iOS
function onNotificationAPN(e) {
  console.log("ENVENT: " + e.event);
  console.log("E DATA" + JSON.stringify(e));
  if (e.alert) {
    $("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
    // showing an alert also requires the org.apache.cordova.dialogs plugin
    console.log("recived push message");
    didRecievedNotification();
    // alert(e.alert);
    //window.location.reload(true);
  }

  if (e.sound) {
    // playing a sound also requires the org.apache.cordova.media plugin
    var snd = new Media(e.sound);
    snd.play();
  }

  if (e.badge) {
    pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
  }
};

// handle GCM notifications for Android
function onNotification(e) {
  var projectId = (typeof e.payload != 'undefined')?e.payload.projectId:0;
  var projectName = (typeof e.payload != 'undefined')?e.payload.projectName:0;
  
  switch (e.event) {
    case 'registered':
    if (e.regid.length > 0) {
      // Your GCM push server needs to know the regID before it can push to this device
      // here is where you might want to send it the regID for later use.
      window.sessionStorage.setItem("regId", e.regid);
      console.log("regID = " + e.regid);
    }
    break;

    case 'message':
    // if this flag is set, this notification happened while we were in the foreground.
    // you might want to play a sound to get the user's attention, throw up a dialog, etc.
    if (e.foreground) {


     ons.notification.confirm({
      message: e.payload.message + ',>>> Đến chi tiết tin nhắn ?',
      callback: function(idx) {
        switch(idx) {
          case 0:

          break;
          case 1:
             // Push to detail page
          var elem = angular.element(document.querySelector('[ng-controller]'));
          //get the injector.
          var injector = elem.injector();
          //get the service.
          var myService = injector.get('productService');
          //update the service.
          myService.dataDetailProject.CustomerId = projectId;
          myService.dataDetailProject.ProjectName = projectName;
          //apply the changes to the scope.
          elem.scope().$apply();

          var scope = angular.element(document.getElementById("idlistProjectController")).scope();
          scope.$apply(function () {        
            scope.ons.navigator.pushPage('detail.html');
          });
          break;
        }
      }
    });


     didRecievedNotification();





      // window.location.reload(true);
      // on Android soundname is outside the payload.
      // On Amazon FireOS all custom attributes are contained within payload

      // if the notification contains a soundname, play it.
      // playing a sound also requires the org.apache.cordova.media plugin
      // var my_media = new Media("/android_asset/www/plugins" + 'beep.wav');

      // my_media.play();
    } else { // otherwise we were launched because the user touched a notification in the notification tray.
      didRecievedNotification();

      var elem = angular.element(document.querySelector('[ng-controller]'));
      //get the injector.
      var injector = elem.injector();
      //get the service.
      var myService = injector.get('productService');
      //update the service.
      myService.dataDetailProject.CustomerId = projectId;
      myService.dataDetailProject.ProjectName = projectName;
      //apply the changes to the scope.
      elem.scope().$apply();



      var scope = angular.element(document.getElementById("idlistProjectController")).scope();
      scope.$apply(function () {        
        scope.ons.navigator.pushPage('detail.html');
      });
      //window.location.reload(true);
    }


    break;

    case 'error':
    ons.notification.alert({
      message: "Hệ thống bị lỗi nhận tin nhắn, vui lòng liên hệ admin để được support."
    });  

    break;

    default:

    break;
  }
}


function tokenHandler(result) {
  console.log("======TOKEN HANDLE=========");
  console.log(result);
  window.sessionStorage.setItem("regId", result);
  // Your iOS push server needs to know the token before it can push to this device
  // here is where you might want to send it the token for later use.
}

function successHandler(result) {
  console.log("======SUCCESS =========");
  console.log(result);
}

function errorHandler(error) {
  console.log("======HANDLER=========");
  console.log(error);
}

function didRecievedNotification(){
  var userId=JSON.parse(window.sessionStorage.userSessionInfo).userId;
  console.log("didRecievedNotification");
  var db = window.sqlitePlugin.openDatabase({
    name: "tarch_app.db",
    location: 1
  });
  //call api
  $.get(serverUrl + 'projects?q=' +userId).success(
    function(newsProject, status, headers, config) {


      db.transaction(function(tx) {

        tx.executeSql("SELECT * FROM project", [], function(tx, result) {
          var len = result.rows.length;
          console.log("start to compare, local project: "+len);
          var found = false;
          for(var n = 0; n < newsProject.length; n++){
            for(var r = 0; r < len; r++){
              //  console.log(newsProject[n].CustomerId);
              if(result.rows.item(r).customerId == newsProject[n].CustomerId){
                found = true;
                //update if change
                if(result.rows.item(r).feedback != newsProject[n].FeedBack||result.rows.item(r).countNew != newsProject[n].count){
                  console.log("change some shit here: "+newsProject[n].ProjectName);
                  var queryupdate="UPDATE PROJECT SET feedback ='" +newsProject[n].FeedBack+"' ,countNew='"+newsProject[n].count+"' WHERE customerId = '"+result.rows.item(r).customerId+"'";
                  console.log(queryupdate);
                  tx.executeSql(queryupdate);

                }
              }
            }
            //insert if not exist
            if(found == false){
              var customerId = newsProject[n].CustomerId;
              var userId = newsProject[n].UserId;
              var projectName = newsProject[n].ProjectName;
              var feecback = newsProject[n].FeedBack;
              var countNew = newsProject[n].count;
              console.log("start to insert project: "+customerId);
              tx.executeSql("INSERT INTO PROJECT (customerId, userId, projectName, feedback, countNew) VALUES (?,?,?,?,?)", [customerId, userId, projectName, feecback, countNew], function(tx, res) {
                console.log("insertId: " + res.insertId + " -- probably 1");
                console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");

              }, function(e) {
                console.log("ERROR: " + e.message);
              });
            } else {
              found = false;
            }
          }
        });
});

}).error(function(data, status, headers, config) {
  console.log("error cmnr:----"+data);
});

}
