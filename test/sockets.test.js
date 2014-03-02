// make sure app.js is running
var should  = require('should');
var io = require('socket.io-client');

var url = 'http://localhost:3000';

// this is necessary, or else it uses the same (dull) connection and times out
var options = {
  'force new connection': true
}

describe('sockets', function () {
  describe('when I connect', function () {
    describe('and I am the first user', function () {
      it('should wait until I send a '
        +'username before sending the problem', function (done) {

        var client = io.connect(url, options);
        client.on('problem', function (prob) {
          prob.should.ok;
          client.disconnect();
          done();
        });

        client.emit('set username', 'client');
      }); // it
    }); // first user

    describe('and I am not the first user', function () {
      it('should send the current problem '
        + 'without waiting for '
        + 'the client sending a username', function (done) {

        var client = io.connect(url, options);
        client.on('problem', function (prob) {
          prob.should.be.ok;
          client.disconnect();
          done();
        });
      });
    });
  });
});
