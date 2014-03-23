var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
var path    = require('path');
var math    = require('mathjs')();
var fs      = require('fs');

var problem = require(__dirname + '/app/helpers/problem')();
var util    = require(__dirname + '/app/helpers/util')();

app.use(express.static(__dirname + '/app/public'));
require(__dirname + '/app/sockets')(io, util, problem, math);

app.get('/', function (req, res) {
  fs.readFile('./app/views/index.html', 'utf8', function (err, data) {
    if (err) throw err;
    res.type('text/html');
    res.send(200, data);
  });
});

server.listen(3000);
