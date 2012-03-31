var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , attendee = require('./attendee');


var eventSchema = new Schema({
    room: {type: String, index: true}
  , organizer: {
        name: String
      , email: String
    }
  , attendees: [attendee]
  , start_date: Date
  , end_date: Date
  , createdAt : {type: Date, default: Date.now}
});

module.exports = eventSchema;
