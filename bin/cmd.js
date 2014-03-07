#!/usr/bin/env node

var http = require('http');
var ecstatic = require('ecstatic');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2), {
    alias: { p: 'port' },
    default: { port: 0 }
});
var staticd = ecstatic(__dirname + '/../static');

var server = http.createServer(function (req, res) {
    staticd(req, res);
});
server.listen(argv.port);

server.on('listening', function () {
    var port = server.address().port;
    console.log('listening at http://localhost:' + port);
});
