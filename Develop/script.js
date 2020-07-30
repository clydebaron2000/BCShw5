function hoursToMin(hours) {
    if (isNaN(hours)) {
        console.log("ERR hoursToMin did recieved a non-number as input.");
        return false;
    }
    return hours * 60;
}

function minTo24Time(intMin) {
    if (isNaN(intMin)) {
        console.log("ERR minTo24Time did recieved a non-number as input.");
        return false;
    }
    var hour = intMin / 60;
    var min = intMin % 60;
    return ((hour > 9) ? "" : "0") + hour + ":" + ((min > 9) ? "" : "0") + min;
}

function minTo12Time(intMin) {
    if (isNaN(intMin)) {
        console.log("ERR minTo12Time did recieved a non-number as input.");
        return false;
    }
    var hour = intMin / 60;
    var min = intMin % 60;
    var ifAm = true;
    if (hour > 12) {
        ifAm = false;
        hour -= 12;
    }
    return (
        ((hour > 9) ? "" : "0") + hour +
        ":" +
        ((min > 9) ? "" : "0") + min + " " +
        ((ifAm) ? "AM" : "PM"));
}

function getRankEnding(number) {
    var place = number % 10;
    if (place === 1) return "st";
    if (place === 2) return "nd";
    if (place === 3) return "rd";
    return "th";
}

function getTime(DateObj) {
    var hour = DateObj.getHours();
    var min = DateObj.getMinutes();
    return ((hour > 9) ? "" : "0") + hour + ":" + ((min > 9) ? "" : "0") + min;
}
var WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
var MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var today = new Date();
var currentTime = getTime(today);
var timeupdater = setInterval(function() {
    today = new Date();
    currentTime = today.getHours() + ":" + today.getMinutes();
    $("#currentDay").text(WEEKDAY[today.getDay()] + ", " + MONTH[today.getUTCMonth()] + " " + today.getUTCDate() + getRankEnding(today.getUTCDate()));
    $("#currentTime").text(currentTime + ":" + today.getSeconds());
}, 100); //time updates every 10th of a second

$(document).ready(function() {
    var startHour = 6; //for now, will be adjustable
    var endHour = 22; //for now, will be adjustable
    var millitaryTime = false;
    var scheduleArray = JSON.parse(localStorage.getItem("scheduleArray"));
    if (scheduleArray === null || typeof(scheduleArray) !== "object") {
        scheduleArray = new Array(24);
        for (var i = 0; i < scheduleArray.length; i++)
            scheduleArray[i] = "";
    }
    console.log(typeof tempArray);
    //reprinting the field
    $(".container").empty();
    for (hour = startHour; hour < endHour; hour++) {
        const timeString = (millitaryTime) ? minTo24Time(hoursToMin(hour)) : minTo12Time(hoursToMin(hour));
        var addClass;
        if (hour < today.getHours()) {
            addClass = "past";
        } else if (hour > today.getHours()) {
            addClass = "future";
        } else {
            addClass = "present";
        }
        var div = $("<div class='row time-block " + addClass + "'>");
        div.append($("<p class='col-md-2 col-sm-2 hour' style='margin:0'>").text(timeString));
        console.log(hour + " " + addClass);
        var form = $("<textarea class='col-md-8 col-sm-8' id='" + hour + "'>").text(scheduleArray[hour]);
        div.append(form);
        div.append($("<button class='col-md-2 col-sm-2 saveBtn' value='" + hour + "'>").text("Save!"));
        $(".container").append(div); //append div
    }
    $(".saveBtn").on("click", function() {
        const index = $(this).val();
        scheduleArray[index] = $("#" + index + "").val();
        localStorage.setItem("scheduleArray", JSON.parse(scheduleArray));
    });
});