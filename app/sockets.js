module.exports = function (io, util, problem, math) {
  var currentProblem,
      correctAnswer;

  var leaderboard = {};

  io.sockets.on('connection', function (socket) {

    socket.emit('scoreboard', leaderboard);

    socket.on('disconnect', function () {
      socket.get('username', function (err, username) {
        if (err) return console.dir(err);
        delete leaderboard[username];

        socket.broadcast.emit('user disconnect', username);
      });
    });

    if (currentProblem && correctAnswer) {
      socket.emit('problem', currentProblem);
    }

    socket.on('set username', function (username) {

      // if username already exists
      if (leaderboard.hasOwnProperty(username)) {
        socket.emit('username nak');

      // if username doesn't exist
      } else {
        socket.set('username', username, function () {
          socket.emit('username ack', username);
          console.log('SET USERNAME: ' + username);
          leaderboard[username] = 0;
          console.log(leaderboard);
        });

        if (currentProblem === undefined) {
          currentProblem = problem.create().trim();
          console.dir(currentProblem);
          correctAnswer  = Math.floor(math.eval(currentProblem));
          io.sockets.emit('problem', currentProblem);
        }

        socket.broadcast.emit('new user', username);
      }
    });

    socket.on('guess', function (guess) {
      var guess = Number(guess);

      if (guess === correctAnswer) {
        socket.get('username', function (err, username) {
          console.log('CORRECT ANSWER BY: ' + username);
          leaderboard[username]++
          io.sockets.emit('user score', [username, leaderboard[username]]);
        });

        socket.emit('guess status', 'correct');

        currentProblem = problem.create();
        correctAnswer  = Math.floor(math.eval(currentProblem));
        io.sockets.emit('problem', currentProblem);
      } else {
        socket.emit('guess status', 'incorrect');
      }
    });
  });
}
