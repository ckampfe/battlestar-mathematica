define(
  [
    'socket.io/socket.io.js',
    'helpers/util-r',
    'helpers/problem-r'
  ],

  function (io, util, problem) {
    var socket = io.connect('http://localhost');

    return {
      start: [
        socket.on('username ack'),
        socket.on('username nak'),
        socket.on('new user'),
        socket.on('guess status'),
        socket.on('problem', function (problem) { console.log(problem) } ),
        socket.on('user score'),
        socket.on('user disconnect')
      ]
    }
  }
);

