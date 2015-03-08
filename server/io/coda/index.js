/**
 * Main socket.io coda
 */

'use strict';

var async = require('async');
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
      var player = {
        id: uuid.v1(),
        name: names.choose()
      };
      Player.create(player, function (err) {
        if (err) return next(err);
        socket.player = player;
        socket.emit('set cookie', cookie.serialize('player_id', socket.player.id, {expires: new Date(Date.now() + 86400000)}));
        next();
      });
    }
  });

  io.on('connection', function (socket) {
    var player = socket.player;
    console.log(player);

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
          socket.broadcast.emit('room created', room);
          socket.emit('room joined', room);
        });
      });
    });

    socket.on('join room', function (roomId) {
      if (player.roomId) return socket.emit('fail', 'Already in room ' + player.roomId);

      Room.retrieve(roomId, function (err, room) {
        if (err) return socket.emit('fail', err);

        room.playerIds.push(player.id);
        Room.update(room, function (err) {
          if (err) return socket.emit('fail', err);

          player.roomId = room.id;
          Player.update(player, function (err) {
            if (err) return socket.emit('fail', err);

            socket.join(room.id);
            socket.broadcast.to(room.id).emit('player joined', player);
            socket.emit('room joined', room);
          });
        });
      });
    });

    socket.on('leave room', function () {
      // Check does the player in a room
      if (!player.roomId) return socket.emit('fail', 'Not in a room');

      // Get the room
      Room.retrieve(player.roomId, function (err, room) {
        if (err) return socket.emit('fail', err);

        // Delete roomId of the player then update
        delete player.roomId;
        delete player.ready;
        Player.update(player, function (err) {
          if (err) return socket.emit('fail', err);

          // Remove the playerId in the playerIds of the room
          var index = room.playerIds.indexOf(player.id);
          if (index >= 0) room.playerIds.splice(index, 1);
          
          // Check if there is no player in the room
          // If has players, update room and tell all the other player in the room that someone left
          // If no players, destroy the room and tell all players that the room has been destroied
          if (room.playerIds && room.playerIds.length > 0) {
            Room.update(room, function (err) {
              if (err) return socket.emit('fail', err);

              socket.leave(room.id);
              socket.emit('room left', room);
              socket.broadcast.to(room.id).emit('player left', player);
            });
          } else {
            Room.destroy(room.id, function (err) {
              if (err) return socket.emit('fail', err);

              socket.leave(room.id);
              socket.emit('room left', room);
              io.sockets.emit('room destroied', room);
            });
          }
        });
      });
    });

    socket.on('toggle ready', function () {
      // Check does the player in a room
      if (!player.roomId) return socket.emit('fail', 'Not in a room');

      // Get the room
      Room.retrieve(player.roomId, function (err, room) {
        if (err) return socket.emit('fail', err);

        // Update the player's ready state
        player.ready = !player.ready;
        Player.update(player, function (err) {
          if (err) return socket.emit('fail', err);

          socket.broadcast.emit('other player toggled ready', player);
          socket.emit('ready toggled', player);

          // If more than one player in the room, Check does every player in the room ready
          // If everyone is ready, start the game
          if (room.playerIds && room.playerIds.length > 1) {
            async.every(room.playerIds, function (playerId, cb) {
              Player.retrieve(playerId, function (err, player) {
                if (err) {
                  console.error(err.stack);
                  cb(false);
                } else {
                  cb(!!player.ready);
                }
              });
            }, function (allReady) {
              if (allReady) {
                io.to(room.id).emit('game start', {});
              }
            });
          }
        });
      });
    });

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
