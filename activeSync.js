var rpc = require('xmlrpc');
var conf = require('./conf');
var restler = require('restler');
var sprintf = require('sprintf').sprintf;
var fs = require('fs');

var who = 'boston-leatherdistrict@optaros.com';
var params = [ who ];

var request_tmpl = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\
<ResolveRecipients xmlns=\"ResolveRecipients:\">\
<To>%s</To>\
<Options> <MaxAmbiguousRecipients>1</MaxAmbiguousRecipients>\
<Availability>\
<StartTime>2012-04-02T08:00:00.000Z</StartTime>\
<EndTime>2012-04-03T08:00:00.000Z</EndTime> </Availability> </Options></ResolveRecipients>";

var body = fs.readFileSync('/Users/optaros/leather.wbxml');
console.log(body);

///usr/bin/curl -k --basic --user sbutler@optaros.com:74Ed67Hb -H "Host: mex07a.emailsrvr.com" -H "MS-ASProtocolVersion: 12.0" -A "iPhone" --data-binary @activesync.txt -H "Content-Type: application/vnd.ms-sync.wbxml" 'https://mex07a.emailsrvr.com/Microsoft-Server-ActiveSync?Cmd=FolderSync&User=sbutler@optaros.com&DeviceId=Appl83033HCPA4S&DeviceType=iPhone'

var options = {
    data: body
  , username: conf.u
  , password: conf.p
  , headers: {
      "Content-Type": 'application/vnd.ms-sync.wbxml'
    , "MS-ASProtocolVersion": "12.0"
    , "User-Agent" : 'Apple-iPhone3C1/902.176'
  }
};

restler.post(conf.url + conf.path, options)
  .on('complete', function(data, response) {
   //console.log(data); 
   console.log(response.headers);
   console.log(response.rawEncoded); 
   console.log(response.raw); 
   console.log('');
   var b = new Buffer(response.raw);
   fs.open('/Users/optaros/raw.wbxml', 'w', function(err, fd) {
     fs.write(fd, response.raw, 0, b.length, 0);
   });
   console.log('|' + b.toString('utf8') + '|');
  });
