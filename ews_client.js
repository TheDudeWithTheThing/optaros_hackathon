var https = require('https')
  , fs = require('fs')
  , xml2js = require('xml2json')
  , conf = require('./conf');

var ews_client = function(room, start, end, save_callback) {
  auth = conf.auth;

  startTime =  '2012-04-01T00:00:00';
  endTime = '2012-04-30T23:59:59';

  fs.readFile('./availability.template', 'utf-8', function(err,data){
    if(err) {
      console.error("Could not open file: %s", err);
      process.exit(1);
    }

    data = data.replace("ROOM",room);
    data = data.replace("STARTTIME",startTime);
    data = data.replace("ENDTIME",endTime);

    var headers = {
      'Host': conf.host,
      'Content-Type': 'text/xml',
      'Content-Length': Buffer.byteLength(data,'utf8'),
      'User-Agent': 'nodejs',
      'Accept': '*/*',
      'Expect': '100-continue'
    };

    var options = {
      host: conf.host,
      port: 443,
      path: '/EWS/Exchange.asmx',
      method: 'POST',
      auth: auth,
      headers: headers
    };

    var req = https.request(options, function(res) {
      var bodyarr = [];
      res.on('data', function(chunk){
        bodyarr.push(chunk);
      })

      res.on('end', function() {
        var xml = bodyarr.join(''); 
        var json = xml2js.toJson(xml); //returns an string containing the json structure by default
        var result = JSON.parse(json);
        save_callback(room, result);
      });
    });

    req.on('error', function(e) {
      console.error(e);
    });

    req.write(data);
    req.end();
  });
}

module.exports = ews_client;
