var mongoose = require('mongoose')
  , roomSchema = require('./model/room')
  , util = require('util')
  , conf = require('./conf')
  , db = mongoose.createConnection('mongodb://'+conf.db.host + '/' + conf.db.schema)
  , roomModel = db.model('room', roomSchema)
  , https = require('https')
  , fs = require('fs')
  , xml2js = require('xml2json')
  , ews_client = require('./ews_client');


function save_availability(room_name, ews_response) {
  var room = new roomModel({room: room_name});
  room.CalendarEvent = ews_response['soap:Envelope']['soap:Body'].GetUserAvailabilityResponse.FreeBusyResponseArray.FreeBusyResponse.FreeBusyView.CalendarEventArray.CalendarEvent;
  console.log('processing: ' + room_name);

  roomModel.update({room: room_name}, {$set: {CalendarEvent: room.CalendarEvent}}, {upsert: true},  function(err) {
    if (err) console.log(err);
    if (!err) console.log('saved: ' + room_name);
  });

  console.log('no exit: ' + room_name);
}



var start = new Date();
var end = new Date().setMonth( start.getMonth() + 1 );

conf.rooms.forEach( function(room) {
  ews_client(room, start, end, save_availability);
});
