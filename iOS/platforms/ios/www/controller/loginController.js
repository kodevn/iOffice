'use strict';


angular.module('app').controller('loginController', function($scope, $http, productService,Project,User,Detail) {

  $scope.tabbar.setTabbarVisibility(false);
  $scope.projects = {};

  $scope.pushPage = function(pagename) {

    $rootScope.ons.navigator.pushPage(pagename);
  };

  $scope.login = function(user) {
      spinnerplugin.show({
    overlay: false,    // defaults to true
    timeout: 10,       // defaults to 0 (no timeout)
    fullscreen: true,  // defaults to false
});
    if (typeof(user) != 'undefined') {
      if (user.email != '' || user.password != '') {
        var dataSend = {};
        dataSend.email = user.email;
        dataSend.pwd = user.password;
        dataSend.uuid = window.sessionStorage.regId;
        dataSend.os = device.platform;

        $.ajax({
          url: serverUrl + "login",
          data: JSON.stringify(dataSend),
          type: "POST",
          success: function(res) {
            if (res.status != "Failed") {

              if (res.IsLock == 1) {
                ons.notification.alert({
                  message: 'Tài khoản của bạn tạm thời đã bị khóa! [0.1]'
                });
                spinnerplugin.hide();
                return false;
              }
              if (res.IsDelete == 1) {
                ons.notification.alert({
                  message: 'Tài khoản của bạn đã bị xóa khỏi hệ thống! [0.2]'
                });
                spinnerplugin.hide();
                return false;
              }


              $scope.users = res;
              productService.dataUserSetting = res;
              productService.flagListProject = false;

              var returnUser={
                userId:res.ID,
                email:res.Email,
                username:res.Username,
                avatar:res.avatar,
                bg:'bg.jpg',
              };
              window.sessionStorage.setItem("userSessionInfo", JSON.stringify(returnUser));
              console.log("userId current: "+JSON.parse(window.sessionStorage.userSessionInfo).userId);
              console.log("===LOGIN SUCCESS===");
              console.log("===STORE DATA SESSION TO TABLE===");

              //insert current User
              User.insertUser(res.ID,res.Email,res.Username,res.avatar);
              //insert list project
              //var insertResult=Project.insertAllProject(res.ID);
              //insert list feedback
             // Detail.insertAllFeedback(res.ID);


              setTimeout(function() {
                console.log("waiting timeout 2 seconds");
                $scope.ons.navigator.pushPage('project.html');
              },2000);//waiting 2 seconds for set user

            } else {
              spinnerplugin.hide();
              ons.notification.alert({
                message: 'Email hoặc mật khẩu không hợp lệ! [1.1]'
              });
              spinnerplugin.hide();
              return false;

            }
          },
          error: function(xhr, ajaxOptions, thrownError) {
            spinnerplugin.hide();
            console.log(xhr.status);
            console.log(xhr.responseText);
            ons.notification.alert({
              message: 'Không thể kết nối server, vui lòng kiểm tra network [1.2]'
            });

          }
        });

      } else {
        spinnerplugin.hide();
        ons.notification.alert({
          message: 'Email hoặc mật khẩu không hợp lệ! [1.3]  '
        });

      }
    } else {
      spinnerplugin.hide();
      ons.notification.alert({
        message: 'Email hoặc mật khẩu không được để trống [1.3]'
      });

    }
  };


});
