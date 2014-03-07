var should  = require('should');
var problem = require('../public/scripts/helpers/problem')();

describe('problem', function () {
  describe('#create()', function () {
    it("should be a string", function () {
      problem.create().should.be.type('string');
    });

    it("should return a problem with at least 2 terms", function () {
      problem.create().split(' ').length.should.be.greaterThan(2);
    });

    it("should return a problem with less than 5 terms", function () {
      // assert 8, due to it being 4 terms and 3 operators. ops = terms - 1
      problem.create().split(' ').length.should.be.lessThan(8);
    });

    it("should be at least a little bit random", function () {
      var probs = [];
      for (var i = 0; i < 3; i++) {
        probs.push(problem.create());
      }

      probs[0].should.not.equal(probs[1]);
      probs[1].should.not.equal(probs[2]);
    });
  });
});
