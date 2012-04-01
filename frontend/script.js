var canvas = document.getElementById('calendar');
var eventBoxWidth = 260;
var eventLeftOffset = 50;

startTime();
setDate();


// Check the element is in the DOM and the browser supports canvas
if (canvas.getContext) {
    drawTimeLines();
    drawEvent(495, 540);
}

function drawTimeLines() {
    var context = canvas.getContext('2d');
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
function drawEvent (startTime, endTime, available) {
    var begin = startTime * 2;
    var duration = (endTime - startTime) * 2;
    var context = canvas.getContext('2d');
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