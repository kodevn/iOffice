'use strict';


angular.module('app').controller('settingUserController', function($scope, productService,User, $http) {
  $scope.tabbar.setTabbarVisibility(true);

  //$scope.dataUserSetting = productService.dataUserSetting;

  var scope = angular.element(document.getElementById("settingUserController")).scope();
  //var settings=User.getUser(window.sessionStorage.userSessionInfo);
  var settings=JSON.parse(window.sessionStorage.userSessionInfo);
  $scope.dataUserSetting = settings;

  if($scope.dataUserSetting.avatar == null || $scope.dataUserSetting.avatar == ''){
   $scope.dataUserSetting.avatar = 'img/avatar.jpg';
 }

 $scope.defaultSelectBg = (typeof(settings.bg) != 'undefined')?settings.bg:'bg.jpg';



 $scope.bgSelect = function(data){
    // Object {userId: 4, email: "thao.hoang@dbplus.com.vn", avatar: "http://rims.noip.me:7778/data/thumbnails/4.JPG", username: "Thao Hoang"}

    User.updateUser(settings.userId,settings.email,settings.username,settings.avatar, data);
    
    settings.bg = data;
    window.sessionStorage.setItem("userSessionInfo", JSON.stringify(settings));

    ons.notification.alert({    
      message : 'Bạn đã chọn hình nền ' + data
    });
  }

//thien added 25/12/2015
 $scope.gotoAbout = function(){
     console.log("go to about");
     $scope.ons.navigator.pushPage('about.html');
      
  };
  $scope.gotoPolicy = function(){
     console.log("go to policy");
     $scope.ons.navigator.pushPage('policy.html');
      
  };  
     $scope.gotoBackground = function(){
     console.log("go to background");
     $scope.ons.navigator.pushPage('background.html');
      
  };  
                                
  $scope.backDefault = "checked";
  $scope.logoutUser = function() {
     spinnerplugin.show({
    overlay: false,    // defaults to true
    timeout: 10,       // defaults to 0 (no timeout)
    fullscreen: true,  // defaults to false
});

    // call service delete user    
     $http.get(serverUrl + 'deleteUserToken?q=' + JSON.parse(window.sessionStorage.userSessionInfo).userId).success(
      function(data, status, headers, config) {        
        spinnerplugin.hide();
      }).error(function(data, status, headers, config) {
        console.log(data);
      });


    window.sessionStorage.setItem("userSessionInfo", null);

    var db = window.sqlitePlugin.openDatabase({
      name: "tarch_app.db",
      location: 1
    });

    db.transaction(deleteUserId);

    setTimeout(function(){ 
      window.location.reload(true);
      spinnerplugin.hide();
    }, 1000);
  };
    
    //update photo
           $scope.changeProfilePhoto= function() {

            console.log(settings.userId);
            var options = {
          quality: 45,
          targetWidth: 264,
          targetHeight: 264,
          destinationType: Camera.DestinationType.FILE_URI,
          encodingType: Camera.EncodingType.JPEG,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        };
        navigator.camera.getPicture(
          function(imageURI) {
            console.log(imageURI);
          //  upload(imageURI, customerId, userId,Detail);
              var imgProfile = document.getElementById('imgProfile');

            // Show the captured photo
            // The inline CSS rules are used to resize the image
            //
            imgProfile.src = imageURI;
                   var ft = new FileTransfer(),
        options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = settings.userId + ".jpg"; // We will use the name auto-generated by Node at the server side.
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;
        options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
          "description": "Uploaded from my phone",
          "userId": settings.userId
        };
                 ft.upload(imageURI, photoSever + "/service/UpdateProfilePhoto",
          function(e) {
          // upload photo
         console.log(JSON.parse(e.response));
        },
        function(e) {
          ons.notification.alert({
            message: 'Tải hình thất bại [5.2]'
          });
          spinnerplugin.hide();
        }, options);
              
              
              
              
              return false;
          },
          function(message) {
              // We typically get here because the use canceled the photo operation. Fail silently.
               return false;
            }, options);
          };
    
});


function deleteUserId(tx) {
  console.log("===DELETE user_info_session -  LOGOUT===");
  tx.executeSql('DROP TABLE IF EXISTS user');
  tx.executeSql('DROP TABLE IF EXISTS project');
  tx.executeSql('DROP TABLE IF EXISTS feedback');
}
