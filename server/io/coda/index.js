/**
 * Main socket.io coda
 */

'use strict';

var cookie = require('cookie');
var CircularJSON = require('circular-json');
var Player = require('../../models/player');
var Room = require('../../models/room');

module.exports = function(io) {

  io.on('connection', function (socket) {

    socket.on('create room', function () {
      var player = Player.get(socket.cookies.player_id);
      if (!player) return socket.emit('fail', 'player not defined');

      if (player.room)
        return socket.emit('fail', 'Already in room ' + player.room.id);

      player.createRoom();

      socket.join(player.room.id);
      socket.broadcast
        .emit('room created', CircularJSON.stringify(player.room));
      socket.emit('room joined', CircularJSON.stringify(player.room));
    });

    socket.on('join room', function (roomId) {
      var player = Player.get(socket.cookies.player_id);
      if (!player) return socket.emit('fail', 'player not defined');

      if (player.room)
        return socket.emit('fail', 'Already in room ' + player.room.id);

      player.join(Room.get(roomId));

      socket.join(player.room.id);
      socket.broadcast.to(player.room.id)
        .emit('player joined', CircularJSON.stringify(player));
      socket.emit('room joined', CircularJSON.stringify(player.room));
    });

    socket.on('leave room', function () {
      var player = Player.get(socket.cookies.player_id);
      if (!player) return socket.emit('fail', 'player not defined');
      // Check does the player in a room
      if (!player.room) return socket.emit('fail', 'Not in a room');

      socket.leave(player.room.id);

      var room = player.leave();

      socket.emit('room left');

      if (room) {
        socket.broadcast.to(room.id)
          .emit('player left', CircularJSON.stringify(player));
      } else {
        io.sockets.emit('room destroied');
      }
    });

    socket.on('toggle ready', function () {
      var player = Player.get(socket.cookies.player_id);
      if (!player) return socket.emit('fail', 'player not defined');
      // Check does the player in a room
      if (!player.room) return socket.emit('fail', 'Not in a room');

      player.toggleReady();

      socket.broadcast.to(player.room.id)
        .emit('other player toggled ready', CircularJSON.stringify(player));
      socket.emit('ready toggled', CircularJSON.stringify(player));
    });

    socket.on('draw', function (params) {
      var player = Player.get(socket.cookies.player_id);
      if (!player) return socket.emit('fail', 'player not defined');
      // Check does the player in a room
      if (!player.game) return socket.emit('fail', 'Not in a game');
      // TODO Check whether it's the player's turn

      player.draw(params.index);
      socket.emit('you drawed', player.newCard);
    });

    socket.on('place', function (params) {
      var player = Player.get(socket.cookies.player_id);
      if (!player) return socket.emit('fail', 'player not defined');
      // Check does the player in a room
      if (!player.game) return socket.emit('fail', 'Not in a game');
      // TODO Check whether it's the player's turn

      player.place(params.index);
      socket.emit('placed', player.cards);
      socket.broadcast.to(player.room.id)
        .emit('player drawed and placed', player.publish());
    });

    socket.on('guess', function (params) {
      var player = Player.get(socket.cookies.player_id);
      if (!player) return socket.emit('fail', 'player not defined');
      // Check does the player in a room
      if (!player.game) return socket.emit('fail', 'Not in a game');
      // TODO Check whether it's the player's turn

      var result = player.guess(params.playerId, index, number);
      id.to(player.room.id).emit('guessed', result);
    });

    socket.on('disconnect', function () {
      
    });
  });
};

