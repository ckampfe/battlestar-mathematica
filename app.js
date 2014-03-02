var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
var path    = require('path');
var math    = require('mathjs')();

var problem = require(__dirname + '/public/javascripts/helpers/problem')();
var H       = require(__dirname + '/public/javascripts/helpers/util')();

app.use(express.static(__dirname + '/public'));

require('./sockets')(io, H, problem, math);

server.listen(3000);
