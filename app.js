var express = require('express')
  , mongoose = require('mongoose')
  , roomSchema = require('./model/room')
  , conf = require('./conf');

express.logger.token('real_ip', function(req, res) { return req.headers['x-forwarded-for'] || req.socket.remoteAddress; });

var app = express.createServer(
            express.bodyParser() 
          , express['static']( __dirname + "/public")
          , express.logger(':real_ip - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"')
          )
  , db = mongoose.createConnection('mongodb://'+conf.db.host + '/' + conf.db.schema)
  , roomModel = db.model('room', roomSchema);

app.get('/', function(req, res) {
  roomModel.find({}, function(err, docs) {
    res.json(docs);
  });
});

console.log("running");
app.listen(3000);
