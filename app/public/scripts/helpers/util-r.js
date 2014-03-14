define(function (require, exports, module) {
  module.exports = (function () {
    return {
      sample: function (ar) {
        return ar[Math.floor(Math.random() * ar.length)];
      },

      assocArrayify: function (obj) {
        var assoc = [];

        for (var property in obj) {
          if (obj.hasOwnProperty(property)) {
            assoc.push([property, obj[property]]);
          }
        }

        return assoc;
      },

      sortAssocArray: function (a, b) {
        return b[1] > a[1];
      }
    }
  })();
});
