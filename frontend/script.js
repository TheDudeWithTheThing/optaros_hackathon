var canvas = document.getElementById('calendar');
var eventBoxWidth = 260;
var eventLeftOffset = 50;

var data = {"_id":"4f785ba0ac6ca42d7d57080e","room":"boston-downtown@optaros.com","CalendarEvent":[{"BusyType":"Busy","EndTime":"2012-04-02T07:30:00","StartTime":"2012/04/02T07:00:00"},{"BusyType":"Busy","EndTime":"2012-04-02T13:40:00","StartTime":"2012/04/02T08:30:00"},/* {"BusyType":"Busy","EndTime":"2012-04-02T11:30:00","StartTime":"2012-04-02T10:30:00"},{"BusyType":"Busy","EndTime":"2012-04-09T10:00:00","StartTime":"2012-04-09T09:00:00"},{"BusyType":"Busy","EndTime":"2012-04-16T10:00:00","StartTime":"2012-04-16T09:00:00"},{"BusyType":"Busy","EndTime":"2012-04-23T10:00:00","StartTime":"2012-04-23T09:00:00"},{"BusyType":"Busy","EndTime":"2012-04-26T09:00:00","StartTime":"2012-04-26T08:00:00"},{"BusyType":"Busy","EndTime":"2012-04-30T10:00:00","StartTime":"2012-04-30T09:00:00"} */]};

startTime();
setDate();

// Check the element is in the DOM and the browser supports canvas
if (canvas.getContext) {
    var context = canvas.getContext('2d');
    drawTimeLines(context);
    for (var i = 0; i < data.CalendarEvent.length;  i++) {
         var info = data.CalendarEvent[i]
         drawEvent(context, timeInMinutes(hackDate(info.StartTime)), timeInMinutes(hackDate(info.EndTime)));
    }
}

function drawTimeLines(context) {
    for (h = 0; h < 24; h++) {
        if (h==0) continue;
        beginY = h * 60 * 2;
        endX = 324;
        
        // Text for that line
        var z = "AM";
        var displayH = h;
        if (h >= 12 && h <= 23) {
            z = "PM";
        }
        if (h > 12 && h <= 23) {
            displayH = (h % 12);
        }

        displayH = displayH + " " + z;
        context.fillText(displayH, 5, beginY);
        
        // Line
        context.beginPath();
        context.moveTo(40, beginY);
        context.lineTo(endX, beginY);
        context.closePath();
        context.stroke();
    }
}

// startTime and endTime must be in minutes starting from midnight.
function drawEvent (context, startTime, endTime) {
    var begin = startTime * 2;
    var duration = (endTime - startTime) * 2;
    context.fillRect(eventLeftOffset, begin, eventBoxWidth, duration);   
}

function startTime()
{
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    
    var positionTime = ((h * 60) + m) * 2;

    var z = "AM";
    if (h >= 12 && h <= 23) {
        z = "PM";
    }
    h = h % 12;
    if (h == 0) {
        h = 12;
        setDate();
    }

    // add a zero in front of numbers<10
    m = checkTime(m);
    document.getElementById('currentTime').innerHTML = h+ ":" + m + z;
    
    // Sets the window to scroll to the correct spot
    var scrollPosition = positionTime - 337;
    window.scrollTo(0, scrollPosition);    
    
    // Add text to the block that is generated
    t = setTimeout('startTime()', 500);    
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function setDate () {
    var today = new Date();
    var wd = today.getDay();
    var d = today.getDate();
    var m = today.getMonth();
    
    var days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');    
    var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    document.getElementById('currentWeekDay').innerHTML = days[wd];
    document.getElementById('currentDate').innerHTML = months[m] + " " + d;
}

function timeInMinutes(time) {
    var date = new Date(time);
    var m = date.getMinutes();
    var h = date.getHours() * 60;
    var total = m + h;
    return total;
}

function hackDate(d) {
    return d.replace(/-/g, '/').replace('T', ' ');
}