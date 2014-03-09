var should    = require('should');
var math      = require('mathjs')();
var webdriver = require('selenium-webdriver');
var io        = require('socket.io-client');

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
      var client;

      beforeEach(function (done) {
        var url     = 'http://localhost:3000';
        var options = { 'force new connection': true };

        client = io.connect(url, options);
        client.on('username ack', function (username) {
          done();
        });

        driver.get(url).then(function () {
          setTimeout(function () {
            client.emit('set username', 'brak');
          }, 500);
        });
      });

      it('there is a scoreboard containing users and scores', function (done) {
        var scoreboard = driver.findElement(webdriver.By.id('scoreboard'));
        scoreboard.getText().then(function (text) {
          text.should.match(/brak: 0/);
          client.disconnect();
          done();
        });
      });

      it('there is a problem', function (done) {
        var problem = driver.findElement(webdriver.By.id('problem'));
        problem.getText().then(function (text) {
          text.should.not.be.empty;
          client.disconnect();
          done();
        });
      });
    });
  });

  describe('when I submit my username', function () {
    beforeEach(function (done) {
      var url     = 'http://localhost:3000';

      driver.get(url);
      driver.findElement(webdriver.By.name('username')).sendKeys('Han');
      driver.findElement(webdriver.By.name('submit')).click()

      // buffer to allow for server
      setTimeout(done(), 300);
    });

    describe('and it is a novel one', function () {
      it('adds me to the scoreboard', function (done) {
        var scoreboard = driver.findElement(webdriver.By.id('scoreboard'));
        scoreboard.getText().then(function (text) {
          text.should.match(/Han: 0/);
          done();
        });
      });

      it('then allows me to enter a guess');
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
