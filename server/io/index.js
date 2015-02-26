/**
 * Main socket.io booter
 */

'use strict';

var cookie = require('cookie');
var redis = require('../components/redis');
var Player = require('../components/coda/player');

module.exports = function(server) {
  var io = require('socket.io')(server);

  io.use(function(socket, next){
    socket.cookies = socket.request.headers.cookie ? cookie.parse(socket.request.headers.cookie) : {};
    next();
  });

  io.use(function (socket, next) {
    var cookies = socket.cookies;
    if (cookies.session_id) {
      redis.hgetall('session:' + cookies.session_id, function (err, obj) {
        if (err) return next(err);
        socket.session = obj;
        next();
      });
    } else {
      next(new Error('No session id'));
    }
  });

  io.use(function (socket, next) {
    if (socket.session) {
      socket.player = new Player(socket);
      next();
    } else {
      next(new Error('Undefined session'));
    }
  });

  // require('./coda')(io.of('/coda'));
  require('./coda')(io);
};
