"strict"
/*
 * DeltaQL Bootstrap.
 * 
 * This is minimal, functioning, web app built using DeltaQL.
 *
 * It's only functionality is to display a list, and allow the user to add
 * items to the list.
 *
 * The list is common to all clients.
 * 
 */

var express = require('express'),
    fs = require('fs'),
    conf = process.conf = require('./conf'),
    options = { //key: fs.readFileSync('./privatekey.pem').toString()
              //, cert: fs.readFileSync('./certificate.pem').toString()
              },
    app = express.createServer(),//options)
    sio = require('socket.io');

app.configure(function(){
  //app.set('view engine', 'ejs');
  app.set('views'      , __dirname + '/views'         );
  app.set('partials'   , __dirname + '/views/partials');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "FIXME: change this to a secret string" }));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler());
});

app.dynamicHelpers({
    session: function(req, res) {
      return req.session;
    },
    sessionID: function(req, res) {
      return req.sessionID;
    }
  }
);


// start express listening
app.listen(conf.server.port, conf.server.host);

// start Socket.IO listening
var io = sio.listen(app);
io.configure(function() {
  io.set('transports', conf.socketio.transports);
  //io.set('logger', console);
});

// make a new Proxy object for each connection
io.sockets.on('connection', function(client) {
});


