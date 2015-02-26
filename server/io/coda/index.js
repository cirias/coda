/**
 * Main socket.io coda
 */

'use strict';

var Room = require('../../components/coda/room');

module.exports = function(nsp) {
  nsp.on('connection', function(socket){
    var player = socket.player;

    socket.on('create room', function (params) {
        player.createRoom(params.name, function (err) {
            if (err) return socket.emit('fail', err);
            nsp.sockets.emit('room created', player.room);
        });
    });

    socket.on('join room', function (roomId) {
        var room = new Room(roomId, true, function () {
            player.join(room, function (err) {
                if (err) return socket.emit('fail', err);
                nsp.to('room:' + room.id).emit('player joined', {
                    id: player.id,
                    name: player.name,
                    roomId: player.roomId
                });
            });
        });
    });

    // socket.on('ready', function () {
    //  player.ready(function (err, game) {
    //    if (err) return socket.emit('error', err);
    //    if (game) {
    //      nsp.to(player.room.id).emit('game start', game);
    //    } else {
    //      nsp.to(player.room.id).emit('player ready', player);
    //    }
    //  });
    // });

    // socket.on('guess', function (params) {
    //  player.guess(params, function (err, result) {
    //    if (err) return socket.emit('error', err);
    //    nsp.to(player.room.id).emit('guess result', result);
    //  });
    // });

    // socket.on('leave room', function () {
    //  var roomId = player.room.id;
    //  player.leave(function (err) {
    //    if (err) return socket.emit('error', err);
    //    nsp.to(roomId).emit('player left', player);
    //  });
    // });

    // socket.on('disconnect', function () {
    //  var roomId = player.room.id;
    //  player.leave(function (err) {
    //    if (err) return socket.emit('error', err);
    //    nsp.to(roomId).emit('player left', player);
    //  });
    // });

    // socket.on('error', function (error) {
    //  console.error(error);
    // });
  });
};
