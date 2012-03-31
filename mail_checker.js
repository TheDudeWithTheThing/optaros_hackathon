var MailParser = require("mailparser").MailParser
  , mail_parser = new MailParser({debug: false})
  , fs = require('fs')
  , mail_message = fs.readFileSync('./mail_message.txt')
  , icalendar = require('icalendar')
  , mongoose = require('mongoose')
  , eventSchema = require('./model/event')
  , attendeeSchema = require('./model/attendee')
  , util = require('util')
  , conf = require('./conf');


var ImapConnection = require('imap').ImapConnection
  , imap = new ImapConnection({
      username: conf.u,
      password: conf.p,
      host: 'imap.gmail.com',
      port: 993,
      secure: true
    })
  , db = mongoose.createConnection('mongodb://'+conf.db.host + '/' + conf.db.schema)
  , eventModel = db.model('event', eventSchema);


var box
  , cmds
  , next = 0
  , cb = function(err) {
  if (err)
    die(err);
  else if (next < cmds.length)
    cmds[next++].apply(this, Array.prototype.slice.call(arguments).slice(1));
};

var mail_message = '';

cmds = [
  function() { imap.connect(cb); },
  function() { imap.openBox('INBOX', false, cb); },
  function(result) { box = result; imap.search([ 'ALL'], cb); },
  function(results) {
    var fetch = imap.fetch(results, { request: { headers: false, body: 'full', struct: false } });
    fetch.on('message', function(msg) {
      console.log('Got message: ' + util.inspect(msg, false, 5));
      msg.on('data', function(chunk) {
        mail_message += chunk;
      });
      msg.on('end', function() {
        console.log('Finished message: ' + util.inspect(msg, false, 5));
      });
    });
    fetch.on('end', function() {
      console.log('Finished Fetch');
      parse_mail(mail_message);
      imap.logout(cb);
    });
  }
];


mail_parser.on('end', function(email) {

  var ical = icalendar.parse_calendar(email.attachments[0].content.toString('utf8'));
  var event = ical.events()[0];
  var to = email.to;
  var from = email.from
  var start = new Date(event.properties.DTSTART.value);
  var end = new Date(event.properties.DTEND.value);

  console.log(to);
  console.log(from);
  console.log(start);
  console.log(end);

  var organizer = {email: from[0].address, name: from[0].name}
    , attendees = []
    , room;

  console.log(organizer);
  attendees.push(organizer);

  to.forEach( function(t) {
    console.log(t.name);

    if(conf.rooms.indexOf(t.address) >= 0) {
      console.log('found room!');
      room = t.name;
    }
    else if (t.address === 'meeting@thedudewiththething.com') {}
    else {
      attendees.push({name: t.name, email: t.address});
    }
  });

  // save to mongo!
  var event = new eventModel({
      room: room
    , organizer: organizer
    , attendees: attendees
    , start_date: start
    , end_date: end
  });

  event.save( function(err) {
    if (err) console.log(err);
    process.exit();
  });

});


function parse_mail(mail_message) {
  mail_parser.write(mail_message);
  mail_parser.end();
}

// start it up (I hate this)
cb();

