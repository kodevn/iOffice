/*
 * Format time
 */
function timeSince(date) {
 //   console.log(date);   
    var aDate = new Date();
    //add +5 hours
    var seconds = Math.floor((((aDate.getTime()+3600000*7) / 1000) - date));  
    
    var dateTimeShow = new Date(date * 1000);
    var dateYear = dateTimeShow.getFullYear();
    var dateMonth = dateTimeShow.getMonth() + 1;
    var dateData = dateTimeShow.getDate();
    var dateHour = dateTimeShow.getHours();
    var dateMinute = dateTimeShow.getMinutes();
    var humanDateTime =  dateHour + "h" + dateMinute+ "' " + dateData+"/" + dateMonth + "/"  +dateYear  ;
    
//    var interval = Math.floor(seconds / 31536000);
//    if (interval >= 1) {
//        return interval + " năm trước";
//    }
    interval = Math.floor(seconds / (86400*7));
    if (interval >= 1) {
        return humanDateTime;
        //return interval + " tháng trước";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval + " ngày trước";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval + " giờ trước";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval + " phút trước";
    }
    return " vừa gửi";
}

