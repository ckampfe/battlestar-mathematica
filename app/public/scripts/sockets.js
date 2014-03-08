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
        socket.on('username ack'),
        socket.on('username nak'),
        socket.on('new user', function (new_user) {
          dom.addUserToScoreboard(new_user);
        }),
        socket.on('guess status'),
        socket.on('problem', function (problem) { console.log(problem) } ),
        socket.on('user score'),
        socket.on('user disconnect')
      ]
    }
  }
);

