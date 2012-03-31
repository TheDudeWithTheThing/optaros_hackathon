var express = require('express')
  , mongoose = require('mongoose')
  , eventSchema = require('./model/event')
  , conf = require('./conf');

express.logger.token('real_ip', function(req, res) { return req.headers['x-forwarded-for'] || req.socket.remoteAddress; });

var app = express.createServer(
            express.bodyParser() 
          , express['static']( __dirname + "/public")
          , express.logger(':real_ip - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"')
          )
  , db = mongoose.createConnection('mongodb://'+conf.db.host + '/' + conf.db.schema)
  , eventModel = db.model('event', eventSchema);

app.get('/', function(req, res) {
  eventModel.find({}, function(err, docs) {
    res.json(docs);
  });
});

console.log("running");
app.listen(3000);
