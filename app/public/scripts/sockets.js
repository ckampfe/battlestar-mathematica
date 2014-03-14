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
            dom.shame();
          }
        }),

        socket.on('problem', function (problem) {
          dom.displayProblem(problem);
        }),

        socket.on('user score', function (userScore) {
          // get scoreboard children
          var children = dom.getScoreboard();
          // remove annoying js builtins
          var childrenKeys = Object.keys(children).filter(function (key) {
            // not keen on type conversion
            if (Number(key) == key) {
              return key;
            }
          });

          // make into 2D array
          children = childrenKeys.map(function (child) {
            var currentItem = children[child].textContent;
            var name  = /(\w+)/.exec(currentItem)[1];
            var score = /\:\ (\d+)/.exec(currentItem)[1];
            return [name, score];
          });

          // remove the one that is to be updated
          var scoreboard = children.filter(function (child) {
            if (child[0] !== userScore[0]) {
              return child;
            }
          });

          // update it, inserting new score
          scoreboard.push(userScore);

          // sort by score
          scoreboard.sort(util.sortAssocArray);

          // wipe scoreboard
          // inject back into scoreboard
          dom.insertScoreboard(scoreboard);
        }),

        socket.on('scoreboard', function (scoreboard) {
          scoreboard = util.assocArrayify(scoreboard);
          if (scoreboard.length > 0) {
            dom.insertScoreboard(scoreboard);
          }
        }),

        socket.on('user disconnect', function (username) {
          var children = dom.getScoreboard();
          // remove annoying js builtins
          var childrenKeys = Object.keys(children).filter(function (key) {
            // not keen on type conversion
            if (Number(key) == key) {
              return key;
            }
          });

          children = childrenKeys.map(function (child) {
            var currentItem = children[child].textContent;
            var name  = /(\w+)/.exec(currentItem)[1];
            var score = /\:\ (\d+)/.exec(currentItem)[1];
            return [name, score];
          });


          var scoreboard = children.filter(function (child) {
            if (child[0] !== username) {
              return child;
            }
          });

          scoreboard.sort(util.sortAssocArray);
          dom.insertScoreboard(scoreboard);
        })
      ]
    }
  }
);
