var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var path    = require('path');
var math    = require('mathjs')();

var problem = require(__dirname + '/public/javascripts/helpers/problem')();
var H       = require(__dirname + '/public/javascripts/helpers/util')();

app.use(express.static(__dirname + '/public'));

require('./socketroutes')(io, H, problem, math);
