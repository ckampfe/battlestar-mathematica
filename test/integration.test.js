var should    = require('should');
var math      = require('mathjs')();
var webdriver = require('selenium-webdriver');
var io        = require('socket.io-client');
var math      = require('mathjs')();

describe('integration', function () {
  this.timeout(4000);
  var driver;

  before(function () {
    driver = new webdriver.Builder()
             .withCapabilities(webdriver.Capabilities.firefox())
             .build();
    driver.manage().timeouts().implicitlyWait(10);
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

        driver.manage().timeouts().implicitlyWait(10);
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

      driver.get(url).then(function () {
        driver.findElement(webdriver.By.name('username')).sendKeys('Han');
        driver.findElement(webdriver.By.name('submit')).click();
      });

      // buffer to allow for server
      setTimeout(done(), 300);
    });

    describe('and it is a novel one', function () {
      it('adds me to the scoreboard', function (done) {
        var scoreboard = driver.findElement(webdriver.By.id('scoreboard'));
        setTimeout(function () {
          scoreboard.getText().then(function (text) {
            text.should.match(/Han: 0/);
            done();
          });
        }, 400);
      });

      it('then allows me to enter a guess', function (done) {
        driver.findElement(webdriver.By.tagName('input')).then(function (guessInput) {
          guessInput.getAttribute('name').then(function (boxName) {
            boxName.should.eql('guess');
            done();
          });
        });
      });
    });

    describe('and it is stale', function () {
      var anotherDriver;

      beforeEach(function (done) {
        anotherDriver = new webdriver.Builder()
             .withCapabilities(webdriver.Capabilities.firefox())
             .build();

        anotherDriver.manage().timeouts().implicitlyWait(10);

        anotherDriver.get('http://localhost:3000').then(function () {
          done();
        });
      });

      after(function () {
        anotherDriver.quit();
      });

      it('continues to prompt me until I enter a novel one', function (done) {
        anotherDriver.findElement(webdriver.By.name('username')).sendKeys('Han');
        anotherDriver.findElement(webdriver.By.name('submit')).click();

        var usernameStatus = anotherDriver.findElement(webdriver.By.id('status'))
        usernameStatus.getText().then(function (text) {
          text.should.match(/[Ii]nvalid/);
          done();
        });
      });
    });
  });

  describe('when I submit a guess', function () {
    describe('and it is the right answer', function () {
      beforeEach(function (done) {
        var url     = 'http://localhost:3000';

        driver.manage().timeouts().implicitlyWait(10);

        driver.get(url).then(function () {;
          driver.findElement(webdriver.By.name('username')).sendKeys('Leia');
          driver.findElement(webdriver.By.name('submit')).click();
        });

        // buffer to allow for server
        setTimeout(done(), 500);
      });

      it('congratulates me', function (done) {
        var problemDiv = driver.findElement(webdriver.By.id('problem'));
        var answer;
        var guessStatusDiv;

        problemDiv.getText().then(function (problem) {

          answer = math.eval(problem);
          return answer;

        }).then(function (answer) {

          // send answer
          driver.findElement(webdriver.By.name('guess')).sendKeys(answer)
          .then(function () {
            driver.findElement(webdriver.By.name('submit')).click();
          });

        }).then(function () {
          // get status element
          guessStatusDiv = driver.findElement(webdriver.By.id('status'))

        }).then(function () {
          // get status
          guessStatusDiv.getText().then(function (text) {
            text.should.match(/Correct! Nice!/);
            done();
          })
        });
      });

      it('increments my score on the scoreboard', function (done) {
        var problemDiv = driver.findElement(webdriver.By.id('problem'));
        var answer;
        var guessStatusDiv;

        problemDiv.getText().then(function (problem) {

          answer = math.eval(problem);
          return answer;

        }).then(function (answer) {

          // send answer
          driver.findElement(webdriver.By.name('guess')).sendKeys(answer)
          .then(function () {
            driver.findElement(webdriver.By.name('submit')).click();
          });

        }).then(function () {
          var scoreboard = driver.findElement(webdriver.By.id('scoreboard'));
          return scoreboard;
        }).then(function (scoreboard) {
          scoreboard.getText().then(function (text) {
            text.should.match(/Leia: 1/);
            done();
          });
        });
      });
    });

    describe('and it is incorrect', function () {
      beforeEach(function (done) {
        var url     = 'http://localhost:3000';

        driver.get(url).then(function () {;
          driver.findElement(webdriver.By.name('username')).sendKeys('Leia');
          driver.findElement(webdriver.By.name('submit')).click();
        });

        driver.manage().timeouts().implicitlyWait(10);
        // buffer to allow for server
        setTimeout(done(), 500);
      });

      // after(function () {
      //   driver.quit();
      // });

      it('shames me', function (done) {
        var problemDiv = driver.findElement(webdriver.By.id('problem'));
        var answer;
        var guessStatusDiv;

        problemDiv.getText().then(function (problem) {

          return 99999999999;

        }).then(function (answer) {

          // send answer
          driver.findElement(webdriver.By.name('guess')).sendKeys(answer)
          .then(function () {
            driver.findElement(webdriver.By.name('submit')).click();
          });

        }).then(function () {
          // get status element
          guessStatusDiv = driver.findElement(webdriver.By.id('status'))

        }).then(function () {
          // get status
          guessStatusDiv.getText().then(function (text) {
            text.should.match(/(YOU FOOL!|Nope...|Wrong!)/);
            done();
          })
        });
      });
    });
  });

  describe('when someone else answers correctly', function () {
    var thirdDriver;
    var client;

    beforeEach(function (done) {
      thirdDriver = new webdriver.Builder()
               .withCapabilities(webdriver.Capabilities.firefox())
               .build();

      thirdDriver.manage().timeouts().implicitlyWait(10);

      var url     = 'http://localhost:3000';
      var options = { 'force new connection': true };

      client = io.connect(url, options);

      thirdDriver.get('http://localhost:3000').then(function () {
        done();
      });
    });

    after(function () {
      // thirdDriver.quit();
    });

    it('shames me', function (done) {
      client.on('problem', function (problem) {
        console.log(problem);
        console.log(math.eval(problem));
        client.emit('guess', math.eval(problem));
        console.log('sent answer');
      });

      client.on('guess status', function (guessStatus) {
        if (guessStatus === 'correct') {
          console.log('correct guess');
          client.disconnect();
          console.log('client disconnected');

          setTimeout(function () {
            thirdDriver.findElement(webdriver.By.id('status'))
            .then(function (statusDiv) {
              console.log('got status div');
              return statusDiv.getText();
            }).then(function (text) {
              console.log('got text');
              text.should.match(/Too slow!/);
              done();
            });
          }, 1000);
        }
      });

      client.emit('set username', 'r2d2');
    });

    it('increments their score on my scoreboard');
  });

  describe('when someone else leaves', function () {
    var thirdDriver;
    var client;

    before(function (done) {
      thirdDriver = new webdriver.Builder()
               .withCapabilities(webdriver.Capabilities.firefox())
               .build();

      thirdDriver.manage().timeouts().implicitlyWait(10);

      var url     = 'http://localhost:3000';
      var options = { 'force new connection': true };

      client = io.connect(url, options);

      client.on('username ack', function (username) {
        done();
      });

      thirdDriver.get('http://localhost:3000').then(function () {
        client.emit('set username', 'lando');
      });
    });

    after(function () {
      thirdDriver.quit();
    });

    it('removes their entry from the scoreboard', function (done) {
      client.disconnect();

      thirdDriver.findElement(webdriver.By.id('scoreboard'))
      .then(function (scoreboard) {
        return scoreboard.getText();
      }).then(function (text) {
        text.should.not.match(/lando: 0/);
        done();
      });
    });
  });
});
