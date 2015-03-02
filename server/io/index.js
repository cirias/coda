/**
 * Main socket.io booter
 */

'use strict';

var cookie = require('cookie');

module.exports = function(server) {
  var io = require('socket.io')(server);

  // parse cookies
  io.use(function(socket, next){
    socket.cookies = socket.request.headers.cookie ? cookie.parse(socket.request.headers.cookie) : {};
    next();
  });

  // require('./coda')(io.of('/coda'));
  require('./coda')(io);
};
