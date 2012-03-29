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
    // uncomment the bits below to enable ssl
    // see http://www.barricane.com/2011/11/24/openssl.html
    options = { //key: fs.readFileSync('./privatekey.pem').toString()
                //, cert: fs.readFileSync('./certificate.pem').toString()
              },
    app = express.createServer(),//options)
    deltaql = require('deltaql');
    
    //sio = require('socket.io');

// utility functions
function cmp(a, b) { return a > b? 1 : a < b ? -1 : 0; }

// setup express
app.configure(function(){
  app.set('view engine', 'ejs');
  app.set('views'      , __dirname + '/views'         );
  app.set('partials'   , __dirname + '/views/partials');
  //app.set('view engine', 'jade');
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
    },
    dqlID: function(req, res) {
      return req.dqlID;
    }
  }
);

// create the database
var rSet = new deltaql.RSet(); // RSet with no parent
// add a couple of test messages
rSet.init([{id:'1',message:'first test comment'},
           {id:'2',message:'second test comment'}
           ]);

// get an RList by sorting the RSet by the message field
var commentList = rSet.sort(function(a,b) { return cmp(a.message, b.message); });
//console.log('commentList', commentList.getRows());

// render the page
app.get('/', index);
function index(req, res) {
  var dqlSess = dql.register(req);
  console.log('dqlID', req.dqlID)
  //console.log('commentList', commentList.getRows());
  dqlSess.add('comment_list', commentList);
  
  res.render('index', { layout: 'layouts/base',
                        title: 'DeltaQL Bootstrap',
                        } );
};


// start express listening
app.listen(conf.server.port, conf.server.host);

// start DeltaQL listening (via SocketIO)
var dql = deltaql.sioListen(app);
dql.configure(function() {
  dql.set('transports', conf.dql.transports);
});


