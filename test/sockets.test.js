// make sure app.js is running
var should  = require('should');
var io      = require('socket.io-client');
var math    = require('mathjs')();

var url = 'http://localhost:3000';

// this is necessary, or else it uses the same (dull) connection and times out
var options = {
  'force new connection': true
}

describe('sockets', function () {
  describe('when I connect', function () {
    describe('and I am the first user', function () {
      it('waits until I send a '
        +'username before sending the problem', function (done) {

        var client = io.connect(url, options);
        client.on('problem', function (prob) {
          prob.should.ok;
          client.disconnect();
          done();
        });

        client.emit('set username', 'river');
      }); // it
    }); // first user

    describe('and I am not the first user', function () {
      it('sends the current problem '
        + 'without waiting for a username', function (done) {

        var client = io.connect(url, options);

        client.on('problem', function (prob) {
          prob.should.be.ok;
          client.disconnect();
          done();
        });
      });
    });
  });

  describe('when I submit a username', function () {
    describe('and the username is novel', function () {
      it('responds with an ack', function (done) {
        var rec;
        var client = io.connect(url, options);

        client.on('username ack', function () {
          rec = 'ack';
          rec.should.eql('ack');

          client.disconnect();
          done();
        });

        client.emit('set username', 'jane');
      });

      it('broadcasts my username to all clients', function (done) {
        var receiver = io.connect(url, options);
        var client = io.connect(url, options);

        receiver.on('new user', function (new_user) {
          receiver.disconnect();
          client.disconnect();
          new_user.should.eql('kara');
          done();
        });

        client.emit('set username', 'kara');
      });
    });

    describe('and the username is stale', function () {
      it('responds with a nak', function (done) {
        var rec;
        var stale  = io.connect(url, options);
        var client = io.connect(url, options);

        // poison username
        stale.emit('set username', 'inara');

        client.on('username nak', function () {
          rec = 'nak';
          rec.should.eql('nak');

          stale.disconnect();
          client.disconnect();
          done();
        });

        // try to set with same username
        client.emit('set username', 'inara');
      });
    });
  });

  describe('when I submit a guess', function () {
    describe('and it is the right answer', function () {
      it('responds with a correct guess status', function (done) {
        var client = io.connect(url, options);

        client.emit('set username', 'wash')

        client.on('guess status', function (guess_data) {
          guess_data.should.eql('correct');
          client.disconnect();
          done();
        });

        client.on('problem', function (problem) {
          var answer = Math.floor(math.eval(problem));
          client.emit('guess', answer);
        });
      });

      it('broadcasts my username and score to all clients', function (done) {
        var client = io.connect(url, options);

        client.emit('set username', 'kailey')

        client.on('user score', function (user_score) {
          user_score.should.eql(['kailey', 1]);
          client.disconnect();
          done();
        });

        client.on('problem', function (problem) {
          var answer = Math.floor(math.eval(problem));
          client.emit('guess', answer);
        });
      });
    });

    describe('and it is incorrect', function () {
      it('responds with an incorrect guess status', function (done) {
        var client = io.connect(url, options);

        client.emit('set username', 'mal')

        client.on('guess status', function (guess_data) {
          guess_data.should.eql('incorrect');
          client.disconnect();
          done();
        });

        client.on('problem', function (problem) {
          var answer = 99999999;
          client.emit('guess', answer);
        });
      });
    });
  });

  describe('broadcasts my username', function () {
    it('removes my username from the leaderboard', function (done) {
      var other = io.connect(url, options);
      var client  = io.connect(url, options);

      client.emit('set username', 'zoe');

      client.on('user disconnect', function (username) {
        username.should.eql('book');
        client.disconnect();
        done();
      });

      // lend some synchronisity
      client.on('username ack', function () {
        other.emit('set username', 'book');

        other.on('username ack', function () {
          other.disconnect();
        });
      });
    });
  });
});
