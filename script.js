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

function getTime(DateObj) {
    var hour = DateObj.getHours();
    var min = DateObj.getMinutes();
    return ((hour > 9) ? "" : "0") + hour + ":" + ((min > 9) ? "" : "0") + min;
}
var startHour = 7,
    endHour = 22;
var WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
var MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var today = new Date();
var currentTime = getTime(today);
var scheduleArray;
var millitaryTime = true;

function updatePage() {
    $(".container").empty();
    for (hour = startHour; hour < endHour; hour++) {
        const timeString = (millitaryTime) ? minTo24Time(hoursToMin(hour)) : minTo12Time(hoursToMin(hour));
        var addClass;
        if (hour < today.getHours()) addClass = "past";
        else if (hour > today.getHours()) addClass = "future";
        else addClass = "present";
        var div = $("<div class='row time-block " + addClass + "'>");
        div.append($("<p class='col-md-2 col-sm-2 hour' style='margin:0'>").text(timeString));
        div.append($("<textarea class='col-md-8 col-sm-8' id='" + hour + "'>").text(scheduleArray[hour]));
        div.append($("<button class='col-md-2 col-sm-2 saveBtn' value='" + hour + "'>").append($("<i class='fas fa-save fa-3x'></i>")));
        $(".container").append(div); //append div
    }
}
var timeupdater = setInterval(function() {
    today = new Date();
    currentTime = today.getHours() + ":" + today.getMinutes();
    $("#currentDay").text(moment().format('dddd, MMMM Do, YYYY'));
    $("#currentTime").text(moment().format("HH:mm:ss"));
}, 100); //time updates every 10th of a second
$(document).ready(function() {
    var startHour = 6; //for now, will be adjustable
    var endHour = 22; //for now, will be adjustable
    var millitaryTime = false;
    scheduleArray = JSON.parse(localStorage.getItem("scheduleArray"));
    if (scheduleArray === null || typeof(scheduleArray) !== "object") {
        scheduleArray = new Array(24);
        for (var i = 0; i < scheduleArray.length; i++) scheduleArray[i] = "";
    }
    updatePage();
    $(".saveBtn").on("click", function() {
        const index = $(this).val();
        scheduleArray[index] = $("#" + index + "").val();
        localStorage.setItem("scheduleArray", JSON.stringify(scheduleArray));
        updatePage();
    });
});