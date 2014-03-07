var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
var path    = require('path');
var math    = require('mathjs')();

var routes  = require(__dirname + '/app/routes');
var problem = require(__dirname + '/app/helpers/problem')();
var util    = require(__dirname + '/app/helpers/util')();

app.use(express.static(__dirname + '/app/public'));
app.set('view engine', 'jade');
app.set('views', path.join(__dirname + '/app/views'));

require(__dirname + '/app/sockets')(io, util, problem, math);

app.get('/', routes.index);

server.listen(3000);
