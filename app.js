var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
var path    = require('path');
var math    = require('mathjs')();

var routes  = require(__dirname + '/routes');
var problem = require(__dirname + '/public/scripts/helpers/problem')();
var util    = require(__dirname + '/public/scripts/helpers/util')();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');

require('./sockets')(io, util, problem, math);

app.get('/', routes.index);

server.listen(3000);
