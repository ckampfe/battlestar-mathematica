module.exports = function () {
  var ops = ['+', '-', '*', '/'];

  function randomInt (upper) {
    return Math.floor(Math.random() * upper) + 2;
  }

  function sample (ar) {
    return ar[Math.floor(Math.random() * ar.length)];
  }

  return {
    create: function () {
      var len = Math.floor(Math.random() * 3 + 1);
      var problem = [];
      var i = 0;

      while (i < len) {
        problem.push(randomInt(7));
        problem.push(sample(ops));
        i++
      }

      // one last time
      problem.push(randomInt(7));
      return problem.join(' ');
    }
  }
}
