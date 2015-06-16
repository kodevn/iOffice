//Get All feedback
function insertAllFeedback($http,userId){
  console.log("userid====="+userId);
  var db = window.sqlitePlugin.openDatabase({
    name: "tarch_app.db",
    location: 1
  });
  //call api
  $http.get(serverUrl + 'getAllFeedback').success(
    function(newsFeedback, status, headers, config) {
      db.transaction(function(tx) {
        for(var n = 0; n < newsFeedback.length; n++){
          var serverId = newsFeedback[n].ID;
          var customerId = newsFeedback[n].CustomerId;
          var userId = newsFeedback[n].UserId;
          var feedbackdate = parseInt(newsFeedback[n].FeedbackDate);//add gmt+7
          feedbackdate=feedbackdate+(7*3600);//add GMT +7
          var content = newsFeedback[n].Content;
          var username = newsFeedback[n].Username;
          var email = newsFeedback[n].email;
          var picture = newsFeedback[n].picture;
          var type = newsFeedback[n].Type;
          console.log("start to insert feedback: "+customerId);
          tx.executeSql("INSERT INTO FEEDBACK (customerId, userId, serverId, content, feedbackdate, username, email, picture, type) VALUES (?,?,?,?,?,?,?,?,?)", [customerId, userId, serverId, content,feedbackdate,username,email,picture, type], function(tx, res) {
            console.log("insertId: " + res.insertId + " -- probably 1");
            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");

          }, function(e) {
            console.log("ERROR: " + e.message);
          });//end of query
        }//end of for
      });//end of transaction

    }).error(function(data, status, headers, config) {
      console.log("error cmnr:----"+data);
    });//end of call api
  };//end of function


  //Get List Project
  function insertListFeedback($http,userId,customerId){
    console.log("userid====="+userId);
    var db = window.sqlitePlugin.openDatabase({
      name: "tarch_app.db",
      location: 1
    });
    db.transaction(function(tx) {
      //call api
      $http.get(serverUrl + 'details?q=' +customerId+'&userId='+userId).success(
        function(newsFeedback, status, headers, config) {
          db.transaction(function(tx) {
            tx.executeSql("SELECT MAX(serverId) AS HighestId FROM FEEDBACK;", [], function(tx, result) {
              //var len = result.rows.length;
              var maxServerId=result.rows.item(0).HighestId;
              console.log("max of serverid : "+maxServerId);

              for(var n = 0; n < newsFeedback.length; n++){
                //  insert lastest feedback
                if(newsFeedback[n].ID > maxServerId){
                  var serverId = newsFeedback[n].ID;
                  var customerId = newsFeedback[n].CustomerId;
                  var userId = newsFeedback[n].UserId;
                  var feedbackdate = parseInt(newsFeedback[n].FeedbackDate);
                  feedbackdate=feedbackdate+(7*3600);//add GMT +7
                  var content = newsFeedback[n].Content;
                  var username = newsFeedback[n].Username;
                  var email = newsFeedback[n].email;
                  var picture = newsFeedback[n].picture;
                  var type = newsFeedback[n].Type;
                  console.log("start to insert feedback: "+customerId);
                  tx.executeSql("INSERT INTO FEEDBACK (customerId, userId, serverId, content, feedbackdate, username, email, picture, type) VALUES (?,?,?,?,?,?,?,?,?)", [customerId, userId, serverId, content,feedbackdate,username,email,picture, type], function(tx, res) {
                    console.log("insertId: " + res.insertId + " -- probably 1");
                    console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");

                  }, function(e) {
                    console.log("ERROR: " + e.message);
                  });
                }
                //update
              }
            });
          });//end of transaction

        }).error(function(data, status, headers, config) {
          console.log("error cmnr:----"+data);
        });
      });
      return "called inserpojects";
    };


    //Get list local feedback
    function getListFeedback(userId,customerId){
      console.log("userid====="+userId);
      var jsonObj = [];
      var db = window.sqlitePlugin.openDatabase({
        name: "tarch_app.db",
        location: 1
      });
      db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM feedback WHERE customerId="+customerId+" ORDER BY feedbackdate DESC", [], function(tx, result) {
          var len = result.rows.length;
          console.log("lenght of feedback: "+len);

          for(var r = 0; r < len; r++){

            var username = result.rows.item(r).username;
            var customerId= result.rows.item(r).customerId;
            var userId = result.rows.item(r).userId;
            var content = result.rows.item(r).content;
            var email = result.rows.item(r).email;
            var picture = result.rows.item(r).picture;
            var type = result.rows.item(r).type;
            var feedbackdate = result.rows.item(r).feedbackdate;
            var serverId = result.rows.item(r).serverId;
            var localId = result.rows.item(r).localId;
            //  console.log("current local Id: "+localId);
            jsonObj.push({
              customerId: customerId,
              userId: userId,
              content: content,
              email: email,
              picture: picture,
              type: type,
              feedbackdate: feedbackdate,
              localId: localId,
              userId: userId,
              serverId: serverId,
              username: username,
            });
          };
          console.log("lenght of feedback return: "+jsonObj.length);
          return jsonObj;
        });//end query
      });//end transaction
      return jsonObj;
    };



    var localId=0;
    var serverId=0;
    //Insert New Feedback
    function insertNewFeedback($http,userId,customerId,content,username,email,picture,type){
      console.log("content====="+content);
//      var db = window.sqlitePlugin.openDatabase({
//        name: "tarch_app.db",
//        location: 1
//      });
//      db.transaction(function(tx) {
//        var date=new Date();
//        //date.setHours(date.getHours()+7);
//        var feedbackdate=Math.round(date.getTime() / 1000);
//        //insert to local first
//        tx.executeSql("INSERT INTO FEEDBACK (customerId, userId, serverId, content, feedbackdate, username, email, picture, type) VALUES (?,?,?,?,?,?,?,?,?)", [customerId, userId, serverId, content,feedbackdate,username,email,picture, type], function(tx, res) {
//          console.log("insertId: " + res.insertId + " -- probably 1");
//          localId=res.insertId;
//
//        }, function(e) {
//          console.log("ERROR: " + e.message);
//        });//end of insert query
//
//
//
//      });//end of transaction

      //update to server
//      setTimeout(function() {
        var dataMessageSend = {};
        dataMessageSend.CustomerId = customerId;
        dataMessageSend.UserId = userId;
        dataMessageSend.Content = content;
        dataMessageSend.Type = type;
        console.log("message type======"+dataMessageSend.Type);
        $http.post(serverUrl + 'sendfeedback', JSON.stringify(dataMessageSend)).success(
          function(data, status, headers, config) {
            // Push to current feedbacdk\
            serverId=data.ID;
            //update server Id to local
            console.log("server id return: "+serverId);
//            var queryupdate="UPDATE FEEDBACK SET serverId ='" +serverId+"' WHERE localId = '"+localId+"'";
//            console.log(queryupdate);
//            db.transaction(function(tx) {
//              tx.executeSql(queryupdate);
//            });//end of transaction
         }).error(function(data, status, headers, config) {
           //
            console.log(data);
        });

//        },300);//waiting 300 mili seconds


        // return "called inserpojects";
      };//end of function



      angular.module('app.detailService', [])
      .factory('Detail', ['$http',
      function ($http) {
        return {
          insertAllFeedback: function (userId) {
            return insertAllFeedback($http,parseInt(userId));
          },
          insertListFeedback: function (userId,customerId) {
            return insertListFeedback($http,parseInt(userId),parseInt(customerId));
          },
          getListFeedback: function (userId,customerId) {
            return getListFeedback(parseInt(userId),parseInt(customerId));
          },
          insertNewFeedback: function (userId,customerId,content,username,email,picture,type) {
            return insertNewFeedback($http,parseInt(userId),parseInt(customerId),content,username,email,picture,type);
          },
        }

      }]);
