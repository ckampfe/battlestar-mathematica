define(
  [
    'jquery',
    'helpers/util-r',
    'helpers/problem-r',
  ],

  function ($, util, problem) {
    return {
      addUserToScoreboard:  function (user) {
        $("#scoreboard").append('<p>' + user + ': ' + '0</p>');
      },
    }
  }
);

