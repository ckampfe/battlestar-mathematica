module.exports = function (io, H, problem, math) {
  var currentProblem,
      correctAnswer;

  var leaderboard = {};

  io.sockets.on('connection', function (socket) {
    console.dir('SOCKET CONNECTED');
    if (currentProblem && correctAnswer) {
      // THIS IS NOT HAPPENING
      console.dir('PROBLEM WAS DEFINIED');
      socket.emit('problem', currentProblem);
    }

    socket.on('set username', function (username) {

      // if username already exists
      if (leaderboard.hasOwnProperty(username)) {
        socket.emit('username nak');

      // if username doesn't exist
      } else {
        socket.emit('username ack');
        socket.set('username', username, function () {
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

      }
    });

    socket.on('guess', function (guess) {
      var guess = Number(guess);

      if (guess === correctAnswer) {
        socket.get('username', function (err, username) {
          console.log('CORRECT ANSWER BY: ' + username);
          leaderboard[username]++
        });

        socket.emit('guess status', 'correct');

        io.sockets.emit('leaderboard',
          util.assocArrayify(leaderboard).sort(util.sortAssocArray));

        currentProblem = problem.create();
        correctAnswer  = Math.floor(math.eval(currentProblem));
        io.sockets.emit('problem', currentProblem);
        socket.broadcast.emit('new round');
      } else {
        socket.emit('guess status', 'incorrect');
      }
    });
  });
}
