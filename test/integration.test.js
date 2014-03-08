var should    = require('should');
var math      = require('mathjs')();
var webdriver = require('selenium-webdriver');
var io        = require('socket.io-client');

//driver.quit();

describe('integration', function () {
  this.timeout(4000);
  var driver;

  before(function () {
    driver = new webdriver.Builder()
             .withCapabilities(webdriver.Capabilities.firefox())
             .build();
  });

  beforeEach(function (done) {
    driver.get('http://localhost:3000').then(function () {
      done();
    });
  });

  after(function () {
    driver.quit();
  });


  describe('when I join the game', function () {
    it('contains a field to enter my username', function (done) {
      var usernameInput = driver.findElement(webdriver.By.tagName('input'));

      usernameInput.getAttribute('name')
      .then(function (boxName) {
        boxName.should.eql('username');
        done();
      });
    });

    describe('and I am the first user', function () {
      it('there is no problem displayed', function (done) {
        var problemDiv = driver.findElement(webdriver.By.id('problem'));

        problemDiv.getText().then(function (text) {
          text.should.eql('');
          done();
        });
      });
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
