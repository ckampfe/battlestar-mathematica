var should    = require('should');
var math      = require('mathjs')();
var webdriver = require('selenium-webdriver');
var driver    = new webdriver.Builder().
                withCapabilities(webdriver.Capabilities.firefox()).
                build();

//driver.quit();

describe('integration', function () {
  describe('when I join the game', function () {
    it('contains a field to enter my username');

    describe('and I am the first user', function () {
      it('there is not problem');
    });

    describe('and I am not the first user', function () {
      it('there is a leaderboard containing users and scores');
      it('there is a problem');
    });
  });

  describe('when I submit my username', function () {
    describe('and it is a novel one', function () {
      it('allows me to enter a guess');
      it('adds me to the leaderboard');
    });

    describe('and it is stale', function () {
      it('continues to prompt me until I enter a novel one');
    });
  });

  describe('when I submit a guess', function () {
    describe('and it is the right answer', function () {
      it('congratulates me');
      it('increments my score on the scoreboard');
    });

    describe('and it is incorrect', function () {
      it('shames me');
    });
  });

  describe('when someone else answers correctly', function () {
    it('shames me');
    it('increments their score on my scoreboard');
  });

  describe('when someone else leaves', function () {
    it('removes their entry from the scoreboard');
  });
});
