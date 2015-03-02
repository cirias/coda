/**
 * Main socket.io coda
 */

'use strict';

var uuid = require('node-uuid');
var cookie = require('cookie');
var Moniker = require('moniker');
var names = Moniker.generator([Moniker.adjective, Moniker.noun], {glue: ' '});
var Player = require('../../models/player');
var Room = require('../../models/room');

module.exports = function(io) {

  io.use(function (socket, next) {
    var cookies = socket.cookies;
    console.log(cookies);
    
    if (cookies.player_id) {
      Player.retrieve(cookies.player_id, function (err, player) {
        if (err) return next(err);
        socket.player = player;
        next();
      });
    } else {
      socket.player = {
        id: uuid.v1(),
        name: names.choose()
      };
      socket.emit('set cookie', cookie.serialize('player_id', socket.player.id, {expires: new Date(Date.now() + 86400000)}));
      next();
    }
  });

  io.on('connection', function (socket) {
  var player = socket.player;

  socket.on('create room', function (params) {
    if (player.roomId) return socket.emit('fail', 'Already in room ' + player.roomId);

    var room = {
      id: uuid.v1(),
      name: params.name,
      playerIds: [player.id],
    };
    Room.create(room, function (err) {
      if (err) return socket.emit('fail', err);

      player.roomId = room.id;
      Player.update(player, function (err) {
        if (err) return socket.emit('fail', err);

        socket.join(room.id);
        io.sockets.emit('room created', room);
      });
    });
  });

  socket.on('join room', function (roomId) {
    if (player.roomId) return socket.emit('fail', 'Already in room ' + player.roomId);

    Room.retrieve(roomId, function (err, room) {
      if (err) return socket.emit('fail', err);

      room.playerIds.add(player.id);
      Room.update(room, function (err) {
        if (err) return socket.emit('fail', err);

        player.roomId = room.id;
        Player.update(player, function (err) {
          if (err) return socket.emit('fail', err);

          socket.join(room.id);
          io.to(room.id).emit('player joined', player);
        });
      });
    });
  });

  socket.on('leave room', function () {
    if (!player.roomId) return socket.emit('fail', 'Not in a room');

    Room.retrieve(player.roomId, function (err, room) {
      if (err) return socket.emit('fail', err);

      room.playerIds.splice(player.id, 1);
      Room.update(room, function (err) {
        if (err) return socket.emit('fail', err);

        delete player.roomId;
        Player.update(player, function (err) {
          if (err) return socket.emit('fail', err);

          socket.leave(room.id);
          io.to(room.id).emit('player left', player);
        });
      });
    });
  });

  // socket.on('ready', function () {
  //  player.ready(function (err, game) {
  //    if (err) return socket.emit('error', err);
  //    if (game) {
  //      io.to(player.room.id).emit('game start', game);
  //    } else {
  //      io.to(player.room.id).emit('player ready', player);
  //    }
  //  });
  // });

  // socket.on('guess', function (params) {
  //  player.guess(params, function (err, result) {
  //    if (err) return socket.emit('error', err);
  //    io.to(player.room.id).emit('guess result', result);
  //  });
  // });


  // socket.on('disconnect', function () {
  //  var roomId = player.room.id;
  //  player.leave(function (err) {
  //    if (err) return socket.emit('error', err);
  //    io.to(roomId).emit('player left', player);
  //  });
  // });

  // socket.on('error', function (error) {
  //  console.error(error);
  // });
  });
};
