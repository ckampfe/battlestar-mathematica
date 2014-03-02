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
        console.log('USERNAME ACK EMITTED');
        socket.set('username', username, function () {
          console.log('SET USERNAME: ' + username);
          leaderboard[username] = 0;
          console.log(leaderboard);
        });

        if (currentProblem === undefined) {
          console.log('PROBLEM WAS UNDEFINED');
          currentProblem = problem.create().trim();
          console.dir(currentProblem);
          correctAnswer  = Math.floor(math.eval(currentProblem));
          io.sockets.emit('problem', currentProblem);
        }

      }
    });

    socket.on('disconnect', function () {
      socket.get('username', function (err, username) {
        if (err) return console.dir(err);
        console.log('DELETE USERNAME ' + username);
        delete leaderboard[username];
        console.log(leaderboard);
      });
    });
  });
}
