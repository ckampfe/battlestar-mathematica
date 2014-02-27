var should = require('should');
var util   = require('../public/javascripts/helpers/util')();

describe('util', function () {
  describe('#sample()', function () {
    it('should return an element that exists in the array', function () {
      ['well','hello','there'].should.containEql(util.sample(['well', 'hello', 'there']));
    });

    it('should not mutate the array', function () {
      var dontMutateMe = [1,2,3];
      util.sample(dontMutateMe);
      dontMutateMe.should.eql([1,2,3]);
    });
  });

  describe('#assocArrayify()', function () {
    it('should return an array', function () {
      var myObj = {
        player1: 35,
        player2: 24,
        player3: 59
      }

      util.assocArrayify(myObj).should.be.instanceOf(Array);
    });

    it('should have a length equal to the # of keys in the hash', function () {
      var myObj = {
        player1: 35,
        player2: 24,
        player3: 59
      }

      var myObjLength = Object.keys(myObj).length;

      util.assocArrayify(myObj).should.have.lengthOf(myObjLength);
    });

    it('should have items with length 2', function () {
      var myObj = {
        player1: 35,
        player2: 24,
        player3: 59
      }

      var assoc = util.assocArrayify(myObj);

      assoc.forEach(function (pair) {
        pair.should.have.lengthOf(2);
      });
    });
  });

  describe('#sortAssocArray()', function () {
    it('should sort an associated array ' +
       'in descending order by the second item ' +
       'of each pair', function () {
        var myObj = {
          player1: 35,
          player2: 24,
          player3: 59
        }

        var assoc = util.assocArrayify(myObj);

        assoc.sort(util.sortAssocArray).should.eql([
          ['player3', 59],
          ['player1', 35],
          ['player2', 24]
        ]);
      });
  });
});
