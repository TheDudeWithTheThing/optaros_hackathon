var mongoose = require('mongoose')
  , Schema = mongoose.Schema


var roomSchema = new Schema({
    room: {type: String, index: true}
  , CalendarEvent: [
    {
      StartTime: Date
    , EndTime: Date
    , BusyType: String
    }
  ]
  });

module.exports = roomSchema;
