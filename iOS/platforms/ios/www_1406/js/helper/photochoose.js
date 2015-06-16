'use strict';

var callback = function(buttonIndex, customerId, userId,Detail) {
  setTimeout(function() {
    // like other Cordova plugins (prompt, confirm) the buttonIndex is 1-based (first button is index 1)
    
    if (buttonIndex === 1) {
      getFromLibrary(customerId, userId,Detail);
    }
    if (buttonIndex === 2) {
      takePicture(customerId, userId,Detail);
    }
  });
};
function showConfirm(customerId, userId,Detail) {
  var options = {
    'androidTheme': window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT, // default is THEME_TRADITIONAL
    'title': 'Chọn ảnh từ “Thư viện hình” hoặc chụp một hình mới rồi đăng ngay',
    'buttonLabels': ['Thư viện', 'Chụp ảnh'],
    'androidEnableCancelButton': true, // default false
    'winphoneEnableCancelButton': true, // default false
    'addCancelButtonWithLabel': 'Cancel',
  };
  // Depending on the buttonIndex, you can now call shareViaFacebook or shareViaTwitter
  // of the SocialSharing plugin (https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin)
  window.plugins.actionsheet.show(options,
    function(buttonIndex) {
      callback(buttonIndex, customerId, userId,Detail)
    });
};

function showEmoticon() {
    //modal.show();
    emotion_dialog.show();
  }

  function takePicture(customerId, userId,Detail) {
    var options = {
      quality: 45,
      targetWidth: 1000,
      targetHeight: 1000,
      destinationType: Camera.DestinationType.FILE_URI,
      encodingType: Camera.EncodingType.JPEG,
      sourceType: Camera.PictureSourceType.CAMERA
    };
    navigator.camera.getPicture(
      function(imageURI) {
        console.log(imageURI);
        upload(imageURI, customerId, userId,Detail);
      },
      function(message) {
        // We typically get here because the use canceled the photo operation. Fail silently.
      }, options);

    return false;


  }

  function getFromLibrary(customerId, userId,Detail) {
//    var options = {
//      quality: 45,
//      targetWidth: 1000,
//      targetHeight: 1000,
//      destinationType: Camera.DestinationType.FILE_URI,
//      encodingType: Camera.EncodingType.JPEG,
//      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
//    };
//    navigator.camera.getPicture(
//      function(imageURI) {
//        console.log(imageURI);
//        upload(imageURI, customerId, userId,Detail);
//      },
//      function(message) {
//          // We typically get here because the use canceled the photo operation. Fail silently.
//        }, options);
      
      window.imagePicker.getPictures(
    function(results) {
        for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
            upload(results[i], customerId, userId,Detail);
        }
    }, function (error) {
        console.log('Error: ' + error);
    }, {
        maximumImagesCount: 20,
    }
);

    return false;


  }
      // Upload image to server
      function upload(imageURI, customerId, userId,Detail) {
   
        var ft = new FileTransfer(),
        options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = Date.now() + ".jpg"; // We will use the name auto-generated by Node at the server side.
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;
        options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
          "description": "Uploaded from my phone",
          "CustomerId": customerId
        };
           // Show on feedback
          //message data
        var currentUser=JSON.parse(window.sessionStorage.userSessionInfo);
        var username=currentUser.username;
        var email=currentUser.email;
        var picture=currentUser.avatar;
        var newMessage={};
        newMessage.FeedbackDate = 'vừa gửi';
        newMessage.email = email;
        newMessage.time_side = "timeline-right";
        newMessage.username = "";
        newMessage.side = "bubble--alt chat-left";
        newMessage.picture=picture;
        newMessage.Content=imageURI;
        if (newMessage.picture == null || newMessage.picture == '') {
          newMessage.picture = 'img/avatar.jpg';
        }
        newMessage.Type='Photo';
          //insert to local
          var scope = angular.element(document.getElementById("detailProjectController")).scope();
          scope.$apply(function() {
            scope.listFeedBack.unshift(newMessage);

            spinnerplugin.hide();
          });
          
          //upload to server
        ft.upload(imageURI, photoSever + "/service/upload",
          function(e) {
          // upload photo
          sendMessage(customerId, userId, photoSever + "/attachments/" + JSON.parse(e.response), "Photo",Detail);
        },
        function(e) {
          ons.notification.alert({
            message: 'Tải hình thất bại [5.2]'
          });
          spinnerplugin.hide();
        }, options);
      }
      function sendMessage(customerId, userId, Content, Type,Detail) {
        //message data
        var currentUser=JSON.parse(window.sessionStorage.userSessionInfo);
        var username=currentUser.username;
        var email=currentUser.email;
        var picture=currentUser.avatar;
        //  send to server
        Detail.insertNewFeedback(currentUser.userId,customerId,Content,username,email,picture,"Photo");
    
      };
      function addEmoticon(icon) {
        $('textarea#messagebox').val($('textarea#messagebox').val() + icon).trigger('input');
        //input.trigger('input');
        emotion_dialog.hide();
      }
