var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var path    = require('path');
var math    = require('mathjs')();

var problem = require('./problem')();
var H       = require('./helpers')();

require('./socketroutes')(io, H, problem, math);
