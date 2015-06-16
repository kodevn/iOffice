
//Inser Local User
function insertLocalUser(userId,email,username,avatar){
  console.log("userid====="+userId);


  var db = window.sqlitePlugin.openDatabase({
    name: "tarch_app.db",
    location: 1
  });
  db.transaction(function(tx) {

    tx.executeSql('CREATE TABLE IF NOT EXISTS user (userId INTEGER, email TEXT, avatar TEXT, username TEXT, bg TEXT )');
    console.log("start to insert user: "+userId);
    tx.executeSql("INSERT INTO user (userId, email, avatar, username,bg) VALUES (?,?,?,?,?)", [userId, email, avatar, username, 'bg.jpg'], function(tx, res) {
      console.log("insertId: " + res.insertId + " -- probably 1");
      console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");

    }, function(e) {
      console.log("ERROR: " + e.message);
      });//end of insert user

  });//end of transaction

};//end of function

// Update
function updateLocalUser(userId,email,username,avatar,bg){
  console.log("userid====="+userId);


  var db = window.sqlitePlugin.openDatabase({
    name: "tarch_app.db",
    location: 1
  });
  db.transaction(function(tx) {

    var queryupdate="UPDATE user SET email ='" +email+"' ,username='"+username+"' ,avatar='"+avatar+"' ,bg='"+bg+"' WHERE userId = '"+userId+"'";
    
    console.log(queryupdate);
    tx.executeSql(queryupdate);


  });//end of transaction

};//end of function

//Get local User
function getLocalUser(userId){
  console.log("userid====="+userId);
  var jsonObjUser = [];
  var db = window.sqlitePlugin.openDatabase({
    name: "tarch_app.db",
    location: 1
  });
  db.transaction(function(tx) {
    tx.executeSql("SELECT * FROM user WHERE userId="+userId, [], function(tx, result) {
      var len = result.rows.length;
      console.log("lenght of user: "+len);

      for(var r = 0; r < len; r++){
        var userId = result.rows.item(r).userId;
        var email = result.rows.item(r).email;
        var username = result.rows.item(r).username;
        var avatar = result.rows.item(r).avatar;

        jsonObjUser.push({
          userId: userId,
          email: email,
          username: username,
          avatar: avatar,
        });
      };
      return jsonObjUser;
    });//end query

  });//end transaction
  console.log("lenght of  return: "+jsonObjUser.length);
  return jsonObjUser;
};

angular.module('app.userService', [])
.factory('User', ['$http',
  function ($http) {
    return {
     getUser: function (userId) {
       return getLocalUser(parseInt(userId));
     },
     insertUser: function (userId,email,username,avatar) {
       return insertLocalUser(parseInt(userId),email,username,avatar);
     },
     updateUser: function (userId,email,username,avatar,bg) {
       return updateLocalUser(parseInt(userId),email,username,avatar,bg);
     }
   }

 }]);
