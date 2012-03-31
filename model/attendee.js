
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var attendeeSchema = new Schema({
    name: String
  , email: String
});

module.exports = attendeeSchema;
