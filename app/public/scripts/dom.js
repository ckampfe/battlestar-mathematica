define(
  [
    'jquery',
    'helpers/util-r',
    'helpers/problem-r'
  ],

  function ($, util, problem) {
    return {
      listeners: function (socket) {
        $("#username_form").submit(function (event) {
          var username = $('input[name="username"]').val();
          socket.emit('set username', username);
          console.log('username');
          event.preventDefault();
        });
      },

      addUserToScoreboard: function (user) {
        $("#scoreboard").append('<p>' + user + ': ' + '0</p>');
      },

      displayProblem: function (problem) {
        $("#problem").empty();
        $("#problem").append(problem);
      },
    }
  }
);

