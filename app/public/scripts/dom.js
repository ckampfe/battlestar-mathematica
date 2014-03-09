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

      makeGuessInput: function () {
        $(".inputs").empty();
        $(".inputs").html(
            '<form id="guess">'
            + '<input type="text" name="guess" placeholder="guess">'
            + '<input type="submit" value="submit">'
            )
      },

      displayNak: function () {
        $('input[name="guess"]').empty();
        $("#status").empty();
        $("#status").html(
            '<p>Invalid username; please try another.</p>'
            )
      },
    }
  }
);

