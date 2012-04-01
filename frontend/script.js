function start(data) {
    canvas = document.getElementById('calendar');
    eventBoxWidth = 260;
    eventLeftOffset = 50;

    canvas.width = canvas.width;

    startTime();
    setDate();

    // Check the element is in the DOM and the browser supports canvas
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        startTime(context);
        toggleAvailable();
    
        
        drawTimeLines(context);
        for (var i = 0; i < data.CalendarEvent.length;  i++) {
             var info = data.CalendarEvent[i]
             var text = "Start at " + displayTime(hackDate(info.StartTime));
             drawEvent(context, timeInMinutes(hackDate(info.StartTime)), timeInMinutes(hackDate(info.EndTime)), text);
        }
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
function drawEvent (context, startTime, endTime, text) {
    context.fillStyle = '#2EB3FE';
    context.stokeStyle = '#222222';

    var begin = startTime * 2;
    var duration = (endTime - startTime) * 2;
    context.fillRect(eventLeftOffset, begin, eventBoxWidth, duration);  
    context.strokeRect(eventLeftOffset, begin, eventBoxWidth, duration);
    
    context.font = '   16px HelveticaNeue';
    context.fillStyle = '#222222';
    context.textBaseline = 'hanging';
    context.fillText(text, eventLeftOffset+ 5, begin + 5)
}

function startTime(context)
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

function displayTime(time) {
    var date = new Date(time);
    var h = date.getHours();
    var m = date.getMinutes();

    var z = "AM";
    if (h >= 12 && h <= 23) {
        z = "PM";
    }
    h = h % 12;
    if (h == 0) {
        h = 12;
    }
    m = checkTime(m);

    
    var text = h + ":" + m + " " + z;
    return text;
}

function hackDate(d) {
    return d.replace(/-/g, '/').replace('T', ' ');
}

function toggleAvailable() {
    if (!checkCurrentAvailable()) {
        document.getElementById('currentEvent').style.display = 'block';
        document.getElementById('upcomingEvents').style.display = 'none';
        document.getElementById('roomOpen').style.display = 'none';
    } else {
        document.getElementById('currentEvent').style.display = 'none';
        document.getElementById('upcomingEvents').style.display = 'block';
        document.getElementById('roomOpen').style.display = 'block';
    }
    t = setTimeout('toggleAvailable()', 60000);
}
function checkCurrentAvailable () {
    currentTime = new Date();
  
    if (data && data.CalendarEvent) {
      for (var i = 0; i < data.CalendarEvent.length;  i++) {
        var info = data.CalendarEvent[i];
        var startTime = new Date(hackDate(info.StartTime));
        var endTime = new Date(hackDate(info.EndTime));

        if (currentTime > startTime && currentTime < endTime) {
          return false;
        }
      }
    }
    
    return true;
}

function callDibs() {
  $.get('/book?room=boston-downtown@optaros.com', function(result_data) {
    alert('Dibs called for Downtown, your request will be processed shortly.');
  }, 'json');
}
