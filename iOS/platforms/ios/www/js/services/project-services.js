
//Get List Project
function insertProjectByUserId($http,userId){
  console.log("userid====="+userId);

  //call api
  $http.get(serverUrl + 'projects?q=' +userId).success(
    function(newsProject, status, headers, config) {

      var db = window.sqlitePlugin.openDatabase({
        name: "tarch_app.db",
        location: 1
      });
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
    return "called inserpojects";
  };

  //Get list local project
  function getListProjectByUserId(userId){
    console.log("userid====="+userId);
    var jsonObjProject = [];
    var db = window.sqlitePlugin.openDatabase({
      name: "tarch_app.db",
      location: 1
    });
    db.transaction(function(tx) {
      tx.executeSql("SELECT * FROM project ORDER BY countNew DESC", [], function(tx, result) {
        var len = result.rows.length;
        console.log("lenght of projects: "+len);

        for(var r = 0; r < len; r++){
          var idc = result.rows.item(r).customerId;
          var userId = result.rows.item(r).userId;
          var countc = result.rows.item(r).countNew;
          var feedback = result.rows.item(r).feedback;
          var projectname = result.rows.item(r).projectName;

          jsonObjProject.push({
            CustomerId: idc,
            UserId:userId,
            count: countc,
            FeedBack: feedback,
            ProjectName: projectname,
          });
        };
        return jsonObjProject;
      });//end query

    });//end transaction
    console.log("lenght of  return: "+jsonObjProject.length);
    return jsonObjProject;
  };

  angular.module('app.projectService', [])
  .factory('Project', ['$http',
  function ($http) {
    return {
      insertAllProject: function (userId) {
        return insertProjectByUserId($http,parseInt(userId));
      },
      getListProject: function (userId) {
        return getListProjectByUserId(parseInt(userId));
      },
    }

  }]);
