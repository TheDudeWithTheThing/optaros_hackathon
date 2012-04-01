var mongoose = require('mongoose');
var conf = require('./conf');

mongoose.connect('mongodb://localhost/dev_hackathon');

var roomSchema = require('./model/room');
var roomModel = mongoose.model('room', roomSchema);
var ews_client = require('./ews_client');


function save_availability(room_name, ews_response) {
  if(!ews_response['soap:Envelope']['soap:Body'].GetUserAvailabilityResponse.FreeBusyResponseArray.FreeBusyResponse.FreeBusyView.CalendarEventArray) {
    process.exit();
  }
  var room = new roomModel({room: room_name});
  room.CalendarEvent = ews_response['soap:Envelope']['soap:Body'].GetUserAvailabilityResponse.FreeBusyResponseArray.FreeBusyResponse.FreeBusyView.CalendarEventArray.CalendarEvent;
  console.log('processing: ' + room_name);

  roomModel.update({room: room_name}, {$set: {CalendarEvent: room.CalendarEvent}}, {upsert: true},  function(err) {
    if (err) console.log(err);
    if (!err) console.log('saved: ' + room_name);
    process.exit();
  });
}

var start = new Date();
start.setDate( start.getDay() );
start.setHours(0);
start.setMinutes(0);
start.setSeconds(0);

var end = new Date();
end.setDate( start.getDay() + 1);
start.setHours(0);
start.setMinutes(0);
start.setSeconds(0);

var room = 'boston-downtown@optaros.com';
ews_client.fetch(room, start, end, save_availability);

