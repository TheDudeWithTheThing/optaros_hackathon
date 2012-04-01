var express = require('express')
  , mongoose = require('mongoose')
  , roomSchema = require('./model/room')
  , conf = require('./conf')
  , ews_client = require('./ews_client')
  , child = require('child_process');

express.logger.token('real_ip', function(req, res) { return req.headers['x-forwarded-for'] || req.socket.remoteAddress; });

var app = express.createServer(
            express.bodyParser() 
          , express['static']( __dirname + "/frontend")
          , express.logger(':real_ip - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"')
          )
  , db = mongoose.createConnection('mongodb://'+conf.db.host + '/' + conf.db.schema)
  , roomModel = db.model('room', roomSchema);

app.get('/data.json', function(req, res) {
  roomModel.find({room: 'boston-downtown@optaros.com', }, function(err, docs) {
    res.json(docs[0]);
  });
});

app.get('/book', function(req, res) {
  var room = req.param('room');
  if(!room)
  {
    res.json({error: 'need a room'});
  }

  var start = new Date();
  start.setSeconds(0);
  start.setMinutes(start.getMinutes() - (start.getMinutes() % 30));

  var end = new Date();
  end.setSeconds(0);
  end.setMinutes(start.getMinutes() + 30);

  ews_client.book(room, start, end, function() {
    child.exec('node availability_checker.js');
    res.json({room: room, start: start.toString(), end: end.toString()});
  });
});

console.log("running");
app.listen(3000);
