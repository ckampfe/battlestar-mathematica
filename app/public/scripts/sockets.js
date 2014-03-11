define(
  [
    'socket.io/socket.io.js',
    'dom',
    'helpers/util-r',
    'helpers/problem-r'
  ],

  function (io, dom, util, problem) {
    var socket = io.connect('http://localhost');

    return {
      start: [
        dom.listeners(socket),
        socket.on('username ack', function (username) {
          dom.addUserToScoreboard(username);
          dom.makeGuessInput(socket);
        }),

        socket.on('username nak', function () {
          dom.displayNak();
        }),

        socket.on('new user', function (username) {
          dom.addUserToScoreboard(username);
        }),

        socket.on('guess status', function (guessStatus) {
          if (guessStatus === 'correct') {
            dom.congratulate();
          } else {
            // dom.shame();
          }
        }),

        socket.on('problem', function (problem) {
          dom.displayProblem(problem);
        }),

        socket.on('user score'),

        socket.on('user disconnect')
      ]
    }
  }
);
