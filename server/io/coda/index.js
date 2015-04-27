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
      // Get current user
      var player = Player.get(socket.cookies.player_id);
      if (!player) return socket.emit('fail', 'player not found');

      if (player.room)
        return socket.emit('fail', 'Already in the room ' + player.room.id);

      player.createRoom();

      socket.join(player.room.id);
      // Tell all players that a new room created
      socket.broadcast
        .emit('room created', CircularJSON.stringify(player.room));
      // Tell current player
      socket.emit('room joined', CircularJSON.stringify(player.room));
    });

    socket.on('join room', function (roomId) {
      var player = Player.get(socket.cookies.player_id);
      if (!player) return socket.emit('fail', 'player not found');

      if (player.room)
        return socket.emit('fail', 'Already in the room ' + player.room.id);

      player.join(Room.get(roomId));

      socket.join(player.room.id);
      // Tell all players in the same room
      socket.broadcast.to(player.room.id)
        .emit('player joined', CircularJSON.stringify(player));
      // Tell current player
      socket.emit('room joined', CircularJSON.stringify(player.room));
    });

    socket.on('leave room', function () {
      var player = Player.get(socket.cookies.player_id);
      if (!player) return socket.emit('fail', 'player not found');
      // Check does the player in a room
      if (!player.room) return socket.emit('fail', 'Not in a room');

      socket.leave(player.room.id);

      var room = player.leave();

      socket.emit('room left');

      // Check whether room still exists
      if (room) {
        socket.broadcast.to(room.id)
          .emit('player left', CircularJSON.stringify(player));
      } else {
        io.sockets.emit('room destroied');
      }
    });

    socket.on('toggle ready', function () {
      var player = Player.get(socket.cookies.player_id);
      if (!player) return socket.emit('fail', 'player not found');
      // Check does the player in a room
      if (!player.room) return socket.emit('fail', 'Not in a room');

      var game = player.toggleReady();

      // Tell all the players in the same room
      socket.broadcast.to(player.room.id)
        .emit('other player toggled ready', CircularJSON.stringify(player));
      // Tell current player
      socket.emit('ready toggled', CircularJSON.stringify(player));

      if (game)
        io.to(player.room.id).emit('game start', game.id);
    });

    socket.on('draw', function (params) {
      var player = Player.get(socket.cookies.player_id);
      if (!player) return socket.emit('fail', 'player not found');
      // Check does the player in a room
      if (!player.game) return socket.emit('fail', 'Not in a game');
      // Check whether it's the player's turn
      if (player.id !== player.game.activePlayerId)
        return socket.emit('fail', 'Not your turn');
      // Check whether the player has already drawed
      if (player.newCard)
        return socket.emit('fail', 'Already drawed a new card');

      var newCard = player.draw(params.index);

      // Tell current user
      socket.emit('you drawed', newCard);
    });

    socket.on('place', function (params) {
      var player = Player.get(socket.cookies.player_id);
      if (!player) return socket.emit('fail', 'player not found');
      // Check does the player in a room
      if (!player.game) return socket.emit('fail', 'Not in a game');
      // Check whether it's the player's turn
      if (player.id !== player.game.activePlayerId)
        return socket.emit('fail', 'Not your turn');

      var result = player.place(params.index);

      // Tell current user
      socket.emit('placed', result.private);
      // Tell all the players in the same room
      socket.broadcast.to(player.room.id)
        .emit('player drawed and placed', result.public);
    });

    socket.on('guess', function (params) {
      var player = Player.get(socket.cookies.player_id);
      if (!player) return socket.emit('fail', 'player not found');
      // Check does the player in a room
      if (!player.game) return socket.emit('fail', 'Not in a game');
      // Check whether it's the player's turn
      if (player.id !== player.game.activePlayerId)
        return socket.emit('fail', 'Not your turn');

      var result = player.guess(params.playerId, params.index, params.number);

      // Tell all the players in the same room include current user
      io.to(player.room.id).emit('guessed', result);
    });

    socket.on('disconnect', function () {
      
    });
  });
};

