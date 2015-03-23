'use strict';

// var _ = require('lodash');
// var async = require('async');
var CircularJSON = require('circular-json');
var Room = require('../../models/room');
var Player = require('../../models/player');

// Get list of rooms
exports.query = function(req, res, next) {
  var start = req.query.start || 0;
  var rows = req.query.rows || 10;

  res.send(CircularJSON.stringify(Room.query(start, start + rows)));
};

// Get the room from the id
exports.get = function(req, res, next) {
  if (!req.params.id) return res.status(400).send('The required params "id" is not found');

  var room = Room.get(req.params.id);
  if (room) {
    console.log(room);
    if (room.players.map(function (p) {return p.id}).indexOf(req.cookies.player_id) >= 0) {
      res.send(CircularJSON.stringify(room));
    } else {
      res.status(403).send('You are not in this room');
    }
  } else {
    res.status(404).send('Not found');
  }
  // Room.retrieve(req.params.id, function (err, room) {
  //   if (err) return next(err);
  //   if (!room) return res.status(404).send('Not found');

  //   room.players = {};
  //   async.each(room.playerIds, function (playerId, cb) {
  //     Player.retrieve(playerId, function (err, player) {
  //       if (err) return cb(err);

  //       room.players[player.id] = player;
  //       cb();
  //     });
  //   }, function (err) {
  //     if (err) return next(err);

  //     res.send(room);
  //   });
  // });
};