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
          console.log('username submitted');
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

      makeGuessInput: function (socket) {
        $(".inputs").empty();
        $(".inputs").html(
          '<form id="guess_form" class="center">'
          + '<input type="text" name="guess" placeholder="guess">'
          + '<input type="submit" name="submit" value="submit">'
          )

        $("#guess_form").submit(function (event) {
          var guess = $('input[name="guess"]').val();
          $('input[name="guess"]').val('');
          socket.emit('guess', guess);
          console.log('problem submitted');
          event.preventDefault();
        });
      },

      displayNak: function () {
        $('input[name="guess"]').empty();
        $("#status").empty();
        $("#status").html(
            '<p>Invalid username; please try another.</p>'
            )
      },

      congratulate: function () {
        $("#status").empty();
        $("#status").html(
            '<p>Correct! Nice!</p>'
            )
      },

      getScoreboard: function () {
        return $("#scoreboard").children();
      },

      insertScoreboard: function (scoreboard) {
        $("#scoreboard").empty();
        if (scoreboard.length > 0) {
          scoreboard.forEach(function (score) {
            $("#scoreboard").append(
              "<p>" + score[0] + ": " + score[1]);
          });
        }
      },

      wrong: function () {
        var wrongs = ['YOU FOOL!', 'Nope...', 'Wrong!'];
        $("#status").empty();
        $("#status").html(
            '<span class="inline">' + util.sample(wrongs) + '</p>'
            )
      },
      shame: function () {
        $("#status").empty();
        $("#status").html(
            '<p>Too slow!</p>'
            )
      }
    }
  }
);

