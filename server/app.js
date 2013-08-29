
/**
 * Module dependencies.
 */

var express = require('express'),
  socketHandler = require('./socket.js'),
  path = require('path'),
  QuoteManager = require('./quotes.js');

var app = module.exports = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  quotes = new QuoteManager();

// Configuration
console.log(quotes);


app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname ,'..','app')));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res){
  res.send(path.join('..','app','index.html'));
});

// Socket.io Communication

io.sockets.on('connection', function(socket){
  socketHandler(socket, quotes);
});

// Start server

server.listen(3000, function(){
  console.log("Express server running in %s mode", app.settings.env);
});