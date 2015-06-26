/*jshint node:true*/
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
// var vhost = require('vhost'); // need for virtual hosts

var app = express();
var server = http.createServer(app);

var io = require('socket.io').listen(server);

app.set('port', process.env.VCAP_APP_PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

// //vhosts
// app.use(vhost('www.votebird.com', app)); // Serves top level domain via Main server app
// app.use(vhost('login.votebird.com', require('./drywall/app.js').app)); // Serves login subdomain via Redirect app

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Handle Errors gracefully
app.use(function(err, req, res, next) {
	if(!err) return next();
	console.log(err.stack);
	res.json({error: true});
});

// Main App Page
app.get('/', routes.index);

// Main App Page
app.get('/biz', routes.bizlist);


// MongoDB API Routes
app.get('/polls/polls', routes.list);
app.get('/polls/:id', routes.poll);
app.post('/polls', routes.create);
app.post('/vote', routes.vote);

app.get('/biz', routes.bizlist);
app.get('/biz/:id', routes.poll);


io.sockets.on('connection', routes.vote);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
