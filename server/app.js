
/**
 * Module dependencies.
 */

var express = require('express'),
  socket = require('./socket.js'),
  path = require('path');

var app = module.exports = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server);

// Configuration

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

io.sockets.on('connection', socket);

// Start server

server.listen(3000, function(){
  console.log("Express server running in %s mode", app.settings.env);
});