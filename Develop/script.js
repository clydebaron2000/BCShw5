'use strict';
var eventData = [{
        title: "First Event",
        color: "gold",
        startDay: "05-08-2020",
        startHour: 3,
        startMinute: 0,
        endDay: "05-08-2020",
        endHour: 5,
        endMinute: 30,
        details: ""
    },
    {
        title: "Second Event",
        color: "orange",
        startDay: "05-08-2020",
        startHour: 2,
        startMinute: 30,
        endDay: "05-08-2020",
        endHour: 3,
        endMinute: 0,
        details: ""
    }
]
$(document).ready(function() {
    var height, maxheight = 45,
        minHeight = 25;
    if ($(this).height() > 500)
        height = maxheight;
    else
        height = minHeight;
    const daysInAWeek = 7;
    const STARTTIME = 0;
    const ENDTIME = 24;
    var smallestInterval = 15;
    var smallestIntervalPerHour = 60 / smallestInterval;
    const duration = ENDTIME - STARTTIME;
    const OFFSET = (moment().utcOffset() / 60);
    const TIMEZONE = "GMT" + ((OFFSET > 0) ? "+" : "") + ((OFFSET < 0) ? "-" : "") + ((Math.abs(OFFSET) < 9) ? "0" : "") + Math.abs(OFFSET);
    const HEADER_ADJUSTMENT = 5.0391;
    const FORMATTING = 'DD-MM-YYYY hh:mm';
    const AMPM = " A";
    var schedule = $(".schedule");
    var weekDates = $(".header");

    weekDates.append($("<div class='timezone' style='grid-area:timezone'>").text(TIMEZONE));
    var weekdays = $("<div class='week' id='weekLabels'>");
    for (var i = 0; i < daysInAWeek; i++) {
        var dayLabel = $("<div class='dayLabel'>");
        dayLabel.append($("<h>").text(moment().add(i, 'day').format('dddd')));
        dayLabel.append($("<h class='dateNumber'>").text(moment().add(i, 'day').format('D')));
        dayLabel.append($("<div class='task'>"))
        weekdays.append(dayLabel);
    }
    //task max height: 5.5x tasks
    weekDates.append(weekdays)
    var col = $("<div class='head col' style='grid-template-rows: repeat(" + (duration) + ", " + height + "px)'>");
    for (var i = STARTTIME; i < duration; i++) {
        col.append($("<div class='times'>").text((i) + ":00"));
    }
    schedule.append(col);

    var body = $("<div class='body'>");
    var line = $("<div class='col' style='z-index:-2;grid-template-rows: repeat(" + (duration) + ", " + height + "px)'>");
    for (var i = STARTTIME; i < duration; i++) {
        line.append($("<div class='spacer'>"));
    }
    body.append(line);
    body.append($("<div class='week' id='overlay'>"));
    body.append(body);
    schedule.append(body);
    var rowHeight = height;

    function dailyEventToDiv(event) {
        var status = (false) ? "future" : "past";
        var div = $("<div class='" + status + "'>");
        div.text(event.title);
        const start = event.startHour * smallestIntervalPerHour + event.startMinute / (60 / smallestIntervalPerHour) + 1;
        const end = event.endHour * smallestIntervalPerHour + event.endMinute / (60 / smallestIntervalPerHour) + 1
        div.attr("style", "background-color:" + event.color + ";grid-area:" + start.toString() + "/1/" + end.toString() + "/1");
        return div;
    }

    function displayOverlayGrid() {
        var overlay = $("#overlay");
        overlay.empty();
        for (var i = 0; i < daysInAWeek; i++) {
            var day = $("<div class='col day' style='padding-right:7px;grid-template-rows: repeat(" + smallestIntervalPerHour * (duration) + "," + (rowHeight) / (smallestIntervalPerHour) + "px)'>");
            var dailyListOfEvents = eventData.filter(function(event) {
                return event.startDay === moment().add(i, 'day').format("DD-MM-YYYY") || event.endDay === moment().add(i, 'day').format("DD-MM-YYYY");
            });
            for (event of dailyListOfEvents) {
                day.append(dailyEventToDiv(event));
            }
            overlay.append(day);
        }
        $("#weekLabels")[0].style.width = $("#overlay")[0].getBoundingClientRect().width + "px";
        $(".timezone")[0].style.width = ($(".head")[0].getBoundingClientRect().width - HEADER_ADJUSTMENT) + "px";
    }
    displayOverlayGrid();
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    $(window).on("resize", function() {
        if ($(this).width() !== windowWidth || $(this).height() !== windowHeight) {
            windowWidth = $(this).width();
            windowHeight = $(this).height();
            //do things
            if (windowHeight > 500)
                height = maxheight;
            else
                height = minHeight;
            console.log(height);
            displayOverlayGrid();
        }
    });
});