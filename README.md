battlestar-mathematica
======================

A math game created for the good folks over at [Belly](https://bellycard.com/).

The idea is simple: you and your friends go to [mathchallenge.nodejitsu.com](http://mathchallenge.nodejitsu.com) and
race to solve math problems.

### Issues:

- The integration test 'when someone else answers correctly it shames me'
  times out.
- The integration test 'when someone else answers correctly it increments their
  score on my scoreboard' is pending.

### To run:

First:
```
npm install
```
#### ...the tests:
```
mocha -R spec
```

#### ...the app:
```
node app
```

### Built with:

- Node.js 0.10.25
- Express 3.4.8
- Socket.io 0.9.16
- Mocha 1.17.1
- Should.js 3.1.3
- Math.js 0.18.1
- RequireJS 2.1.11
- jQuery 2.1.0
- HTML5 Boilerplate 4.3.0
