    'use strict';

    /*
    * Load get list feedback from project information
    */



    angular.module("app")


    .controller('detailProjectController', function($scope,$sce, productService, $http,Detail, $location, $anchorScroll){
      console.log("detail called");
      $scope.tabbar.setTabbarVisibility(false);

      var settings=JSON.parse(window.sessionStorage.userSessionInfo);

      var dataUserSetting= settings;
      dataUserSetting.bg = (typeof(settings.bg) != 'undefined')?settings.bg:'bg.jpg';
      $scope.dataUserSetting = dataUserSetting;
      // get data detail from service

      $scope.projects = {};

      $scope.loadMore = function(){
        // Load page             
        productService.detailPaging = (productService.detailPaging >= 0)?(productService.detailPaging + 1):0;

        // Call backend
        $http.get(serverUrl + 'details?q=' +$scope.detailFeedbackProject.CustomerId+'&userId='+userId+"&page="+productService.detailPaging).success(
          function(data, status, headers, config) {

            if(data.length == 0){
              // 
              $("#loadmorebutton").css({"display":"none"});
              $("#nofeedback").css({"display":""});
           }

           spinnerplugin.show({overlay: true, timeout: 10, fullscreen: true});

           console.log("push more data");
              
           // Format data before push to current list feedback
           for(var i = 0;i < data.length;i++){

            data[i].count = i;

            // Format live time stamp
            data[i].FeedbackDate = timeSince(data[i].FeedbackDate);

            // Set avatar
            if(data[i].picture == null || data[i].picture == ''){
              data[i].picture = 'img/avatar.jpg';
            }
            // replace emoji
            if(data[i].Type == null || data[i].Type == ''){
              $scope.html = replaceEmoji(data[i].Content);
              data[i].Content = $sce.trustAsHtml($scope.html);
            }
          //  console.log(data[i].UserId + "===vs==="+$scope.currentUser.userId);
          if(data[i].UserId == $scope.currentUser.userId){
            data[i].side = "bubble--alt chat-left";
            data[i].time_side = "timeline-right";
            data[i].Username = "";
          }else{
            data[i].side = " chat-right";
            data[i].time_side = "timeline-left";
          }


          $scope.listFeedBack.push(data[i]);  

        }

        

        spinnerplugin.hide();
      }).error(function(data, status, headers, config) {
        console.log(data);
      });

    }

      // $scope.updateListFeedback = function(data){
      //
      //   alert("updateListFeedback");
      //   $scope.listFeedBack = data;
      // };

      $scope.currentUser = $.parseJSON(window.sessionStorage.userSessionInfo);

      productService.dataListProject = {};
      $scope.detailFeedbackProject = productService.dataDetailProject;

      //  var scope = angular.element(document.getElementById("detailProjectController")).scope();

      //  Detail.insertListFeedback(productService.dataUserSetting.ID, $scope.detailFeedbackProject.CustomerId);
      //  var returnData = Detail.getListFeedback(productService.dataUserSetting.ID, $scope.detailFeedbackProject.CustomerId);
      // console.log(data);
      // console.log("userid====="+userId);

      // setTimeout(function(){
      //
      //   console.log("waiting timeout 0.1 seconds");
      //   scope.$apply(function(){
      //
      //     $scope.listFeedBack = returnData;
      //     $scope.counter=$scope.listFeedBack.length;
      //     // Format live time stamp
      //     // $scope.listFeedBack[i].FeedbackDate =
      //     // timeSince($scope.listFeedBack[i].FeedbackDate);
      //
      //     for(var i = 0;i < $scope.listFeedBack.length;i++){
      //
      //       $scope.listFeedBack[i].count = i;
      //
      //       // Format live time stamp
      //       $scope.listFeedBack[i].feedbackdate = timeSince($scope.listFeedBack[i].feedbackdate);
      //
      //       // Set avatar
      //       if($scope.listFeedBack[i].picture == null || $scope.listFeedBack[i].picture == ''){
      //         $scope.listFeedBack[i].picture = 'img/avatar.jpg';
      //       }
      //       // replace emoji
      //       if($scope.listFeedBack[i].type == null || $scope.listFeedBack[i].type == ''){
      //         $scope.html = replaceEmoji($scope.listFeedBack[i].content);
      //         $scope.listFeedBack[i].content = $sce.trustAsHtml($scope.html);
      //       }
      //
      //       if($scope.listFeedBack[i].userId == $scope.currentUser.userId){
      //         $scope.listFeedBack[i].side = "bubble--alt chat-left";
      //         $scope.listFeedBack[i].time_side = "timeline-right";
      //         $scope.listFeedBack[i].username = "";
      //       }else{
      //         $scope.listFeedBack[i].side = " chat-right";
      //         $scope.listFeedBack[i].time_side = "timeline-left";
      //       }
      //
      //     }
      //
      //   });
      //   spinnerplugin.hide();
      // }, 500); // 2 seconds

      // });

      // }).error(function(data, status, headers, config) {
      // console.log(data);
      // });
//
//    angular.element(document).ready(function () {
//     
//      setTimeout(function(){ 
//       
//        $location.hash('gotobottom');
//        $anchorScroll(); 
//        
//      }, 100);
//
//    });

    var currentUser = JSON.parse(window.sessionStorage.userSessionInfo);
    var userId = currentUser.userId;
    $http.get(serverUrl + 'details?q=' +$scope.detailFeedbackProject.CustomerId+'&userId='+userId+"&page=0").success(
      function(data, status, headers, config) {
       spinnerplugin.show({
    overlay: false,    // defaults to true
    timeout: 10,       // defaults to 0 (no timeout)
    fullscreen: true,  // defaults to false
  });
       console.log("data");
       $scope.listFeedBack=data;
       for(var i = 0;i < $scope.listFeedBack.length;i++){

        $scope.listFeedBack[i].count = i;

            // Format live time stamp
            $scope.listFeedBack[i].FeedbackDate = timeSince($scope.listFeedBack[i].FeedbackDate);

            // Set avatar
            if($scope.listFeedBack[i].picture == null || $scope.listFeedBack[i].picture == ''){
              $scope.listFeedBack[i].picture = 'img/avatar.jpg';
            }
            // replace emoji
            if($scope.listFeedBack[i].Type == null || $scope.listFeedBack[i].Type == ''){
              $scope.html = replaceEmoji($scope.listFeedBack[i].Content);
              $scope.listFeedBack[i].Content = $sce.trustAsHtml($scope.html);
            }
          //  console.log($scope.listFeedBack[i].UserId + "===vs==="+$scope.currentUser.userId);
          if($scope.listFeedBack[i].UserId == $scope.currentUser.userId){
            $scope.listFeedBack[i].side = "bubble--alt chat-left";
            $scope.listFeedBack[i].time_side = "timeline-right";
            $scope.listFeedBack[i].Username = "";
          }else{
            $scope.listFeedBack[i].side = " chat-right";
            $scope.listFeedBack[i].time_side = "timeline-left";
          }

        }




        spinnerplugin.hide();
      }).error(function(data, status, headers, config) {
        console.log(data);
      });

        //     // Format live time stamp
        //     // $scope.listFeedBack[i].FeedbackDate =
        //     // timeSince($scope.listFeedBack[i].FeedbackDate);
        //
        // var serverId = newsFeedback[n].ID;
        // var customerId = newsFeedback[n].CustomerId;
        // var userId = newsFeedback[n].UserId;
        // var feedbackdate = parseInt(newsFeedback[n].FeedbackDate);
        // feedbackdate=feedbackdate+(7*3600);//add GMT +7
        // var content = newsFeedback[n].Content;
        // var username = newsFeedback[n].Username;
        // var email = newsFeedback[n].email;
        // var picture = newsFeedback[n].picture;
        // var type = newsFeedback[n].Type;

        


        console.log("end of load feedback list");

        /*
        * Send message
        */
        // {"CustomerId":"aaa","UserId":"111","Content":"test","Type" : "11"}
        $scope.pushMessage = function(message){

          spinnerplugin.show({
    overlay: false,    // defaults to true
    timeout: 10,       // defaults to 0 (no timeout)
    fullscreen: true,  // defaults to false
  });
          if(typeof (message) != 'undefined'){
            if(message.data != ''){
              // message data
              var currentUser = JSON.parse(window.sessionStorage.userSessionInfo);
              var userId = currentUser.userId;
              var customerId = productService.dataDetailProject.CustomerId;
              var content = message.data;
              var username = currentUser.username;
              var email = currentUser.email;
              var picture = currentUser.avatar;
              console.log("avatar====> " + picture);
              var type = '';
              // Show on feedback
              var newMessage = {};
              newMessage.FeedbackDate = 'vừa gửi';
              newMessage.UserId = userId;
              newMessage.Email = email;
              newMessage.picture = picture;
              newMessage.time_side = "timeline-right";
              newMessage.Username = "";
              newMessage.side = "bubble--alt chat-left";
              newMessage.Content = content;
              if(newMessage.picture == null || newMessage.picture == ''){
                newMessage.picture = 'img/avatar.jpg';
              }
              // replace emoji
              $scope.html = replaceEmoji(newMessage.Content);
              newMessage.Content = $sce.trustAsHtml($scope.html);
              newMessage.Type = type;
              // newMessage.username=username;

              // insert to local
              Detail.insertNewFeedback(userId, customerId, content, username, email, picture, type);

              $scope.listFeedBack.unshift(newMessage);
              spinnerplugin.hide();
              message.data = '';

//              angular.element(document).ready(function () {
//               
//                setTimeout(function(){ 
//                 
//                  $location.hash('gotobottom');
//                  $anchorScroll(); 
//                  
//                }, 100);
//
//              });
              // send to server and update serverId
              // var dataMessageSend = {};
              // dataMessageSend.CustomerId =
              // productService.dataDetailProject.CustomerId;
              // dataMessageSend.UserId = productService.dataDetailProject.UserId;
              // dataMessageSend.Content = message.data;
              // $http.post(serverUrl + 'sendfeedback',
              // JSON.stringify(dataMessageSend)).success(
              // function(data, status, headers, config) {
              // // Push to current feedbacdk
              // data.FeedbackDate = timeSince(data.FeedbackDate);
              // data.Email = '';
              // if (data.picture == null || data.picture == '') {
              // data.picture = 'img/avatar.jpg';
              // }
              // //replace emoji
              // if (data.Type == null || data.Type == '') {
              // $scope.html = replaceEmoji(data.Content);
              // data.Content = $sce.trustAsHtml($scope.html);
              //
              // }
              // $scope.listFeedBack.unshift(data);
              //
              // spinnerplugin.hide();
              // message.data = '';
              // }).error(function(data, status, headers, config) {
              //
              // console.log(data);
              // });

  }else{
    spinnerplugin.hide();
    ons.notification.alert({
      message : 'Vui lòng nhập nội dung cần gửi'
    });
  }
}else{
  spinnerplugin.hide();
  ons.notification.alert({
    message : 'Vui lòng nhập nội dung cần gửi!'
  });
}

}
$scope.uploadphoto = function(){

          // getFromLibrary(productService.dataDetailProject.CustomerId,
          // productService.dataUserSetting.ID);
    showConfirm(productService.dataDetailProject.CustomerId, productService.dataUserSetting.ID, Detail);
  }

        /*
        * Back button - in detail project
        */
        $scope.loadListProject = function(){

          productService.flagListProject = true;
          $scope.ons.navigator.pushPage('project.html');
        }

        // goto list project management
        $scope.projectManagement = function(CustomerId){

          productService.CustomerId = CustomerId;
          $scope.ons.navigator.pushPage('project_management.html');
        }
      });

      /*
      * Reload feed again
      */
      function getFeed(serverUrl, userId, projcetId){

        res = [];
        $.ajax({
          url : serverUrl + 'details?q=' + projcetId + '&userId=' + userId,
          type : "GET",
          success : function(res){

            return res;
          },
          error : function(xhr, ajaxOptions, thrownError){

            console.log(xhr.status);
            console.log(xhr.responseText);
            return false;
          }
        });

        if(res.length == 0){
          getFeed(serverUrl, userId, projcetId);
        }

      }


