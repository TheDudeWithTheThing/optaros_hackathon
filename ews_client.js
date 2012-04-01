var https = require('https')
, fs = require('fs')
, xml2js = require('xml2json')
, conf = require('./conf');

var ews_client = {
  fetch: function(room, start, end, save_callback) {
    var data = fs.readFileSync('./availability.template', 'utf-8');
    ews_request(data, room, start, end, save_callback);
  },
  book: function (room, start, end, cb) {
    var data = fs.readFileSync('./book.template', 'utf-8');
    cb();
    //ews_request(data, room, start, end, cb);
  }
}

function ews_request(data, room, start, end, on_response) {
  data = data.replace("ROOM",room);
  data = data.replace("STARTTIME",start.toISOString());
  data = data.replace("ENDTIME",end.toISOString());

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
    auth: conf.auth,
    headers: headers
  };

  var req = https.request(options, function(res) {
    var bodyarr = [];

    res.on('data', function(chunk){
      console.log('data');
      bodyarr.push(chunk);
    })

    res.on('end', function() {
      console.log('ended');
      var xml = bodyarr.join(''); 
      console.log(xml);

      var json = xml2js.toJson(xml); //returns an string containing the json structure by default
      var result = JSON.parse(json);
      on_response(room, result);
    });

  });

  req.on('error', function(e) {
    console.error(e);
  });

  req.write(data);
  req.end();
}

module.exports = ews_client;
